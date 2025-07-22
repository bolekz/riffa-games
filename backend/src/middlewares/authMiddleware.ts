import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// CORREÇÃO: O caminho correto a partir de /src/middlewares/ é '../config/prisma'
import prisma from '../config/prisma';
import { generateResponse } from '../utils/responseHandler';
import logger from '../lib/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json(generateResponse(false, 'Acesso negado. Nenhum token fornecido.'));
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Agora 'prisma' não será mais undefined.
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true }
    });

    if (!user) {
      return res.status(401).json(generateResponse(false, 'Utilizador inválido ou não encontrado'));
    }

    req.user = { id: user.id, role: user.role || 'USER' };
    next();
  } catch (err: any) {
    logger.error('Erro no authMiddleware:', err); // Usaremos o logger que já configurámos
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json(generateResponse(false, 'Token expirado.'));
    }
    return res.status(401).json(generateResponse(false, 'Token inválido ou expirado'));
  }
}

// Usando a sintaxe de exportação moderna
export default authMiddleware;