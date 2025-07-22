// src/modules/auth/auth.service.ts

import type { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import crypto from 'crypto';
import prisma from '../../config/prisma';
import logger from '../../lib/logger';
import mailerService from '../../utils/mailer';
import userEventService, { UserEventTypes } from '../user/services/userEvent.service';
import { encryptCPF } from '../../utils/crypto';
import type { RegisterData, LoginData, UserPayload } from './auth.types';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET!;

const cookieOpts = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge,
  path: '/',
});

async function generateAndSetTokens(res: Response, user: UserPayload): Promise<string> {
  const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id, role: user.role }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
  } catch (err) {
    logger.error(err, `Falha crítica ao salvar refreshToken para o usuário ${user.id}`);
    throw new Error('Falha ao estabelecer a sessão. Por favor, tente novamente.');
  }

  res.cookie('accessToken', accessToken, cookieOpts(15 * 60 * 1000));
  res.cookie('refreshToken', refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000));

  return accessToken;
}

const authService = {
  async register(data: RegisterData) {
    const { name, nickname, email, password, cpf, whatsapp, referralCode } = data;
    const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { nickname }] } });
    if (exists) throw new Error('Email ou nickname já cadastrado.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const cpfHash = cpf ? encryptCPF(cpf) : null;
    const referredById = referralCode
      ? (await prisma.affiliateCode.findUnique({ where: { code: referralCode } }))?.id || null
      : null;

    const newUser = await prisma.user.create({
      data: { name, nickname, email, password: hashedPassword, whatsapp, cpfHash, referredById },
      select: { id: true, name: true, nickname: true, email: true, role: true },
    });
    
    await userEventService.create(newUser.id, UserEventTypes.USER_REGISTERED, { email });
    return newUser;
  },

  async login(data: LoginData, res: Response) {
    const { email, password } = data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Credenciais inválidas.');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      await userEventService.create(user.id, UserEventTypes.USER_LOGIN_FAILURE, { reason: 'Senha inválida' });
      throw new Error('Credenciais inválidas.');
    }

    const accessToken = await generateAndSetTokens(res, { id: user.id, role: user.role });

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await userEventService.create(user.id, UserEventTypes.USER_LOGIN_SUCCESS, { loginMethod: 'PASSWORD' });

    return { user: { id: user.id, nickname: user.nickname, email: user.email, role: user.role }, accessToken };
  },

  async logout(token: string | undefined, res: Response) {
    if (token) {
      await prisma.user.updateMany({ where: { refreshToken: token }, data: { refreshToken: null } });
    }
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    return { message: 'Logout realizado com sucesso.' };
  },

  async refreshToken(token: string | undefined, res: Response) {
    if (!token) throw new Error('Refresh token não fornecido.');

    const userInDb = await prisma.user.findFirst({ where: { refreshToken: token } });
    if (!userInDb) {
      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });
      throw new Error('Refresh token inválido ou revogado.');
    }

    try {
      const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as UserPayload;
      if (decoded.id !== userInDb.id) throw new Error('Inconsistência de token detectada.');

      const newAccess = jwt.sign({ id: decoded.id, role: decoded.role }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
      res.cookie('accessToken', newAccess, cookieOpts(15 * 60 * 1000));
      return { message: 'Token atualizado com sucesso.' };
    } catch (err) {
      logger.error('Erro ao verificar refresh token:', err);
      throw new Error('Sessão inválida. Faça login novamente.');
    }
  },

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.warn(`Tentativa de reset de senha para email não existente: ${email}`);
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = dayjs().add(1, 'hour').toDate();

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: hashed, passwordResetExpires: expires },
    });

    await mailerService.sendPasswordResetEmail(user.email, resetToken);
    await userEventService.create(user.id, UserEventTypes.PASSWORD_RESET_REQUEST, { email });
    logger.info(`Token de reset enviado para ${email}`);
  },

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await prisma.user.findFirst({
      where: { passwordResetToken: hashedToken, passwordResetExpires: { gt: new Date() } },
    });
    if (!user) throw new Error('Token inválido ou expirado.');

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: newHashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    logger.info(`Senha redefinida com sucesso para o utilizador ${user.id}`);
  },
};

export default authService;