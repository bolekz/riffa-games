// src/test/auth.test.ts

import request from 'supertest';
import app from '../app';
import prisma from '../config/prisma';
import { server } from '../server';

describe('Auth Routes', () => {
  beforeAll(async () => {
    // Limpa usuários de testes anteriores
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await server.close();
    await prisma.$disconnect();
  });

  it('deve registrar um novo usuário', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      nickname: 'testuser',
      email: 'test@example.com',
      password: '12345678',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('deve falhar ao registrar com email existente', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Duplicate',
      nickname: 'duplicate',
      email: 'test@example.com',
      password: '12345678',
    });

    const response = await request(app).post('/api/auth/register').send({
      name: 'Duplicate Again',
      nickname: 'duplicate2',
      email: 'test@example.com',
      password: '12345678',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Email já está em uso');
  });

  it('deve fazer login com sucesso', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: '12345678',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('deve falhar ao fazer login com credenciais erradas', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'wrong@example.com',
      password: 'wrongpass',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Credenciais inválidas');
  });
});
