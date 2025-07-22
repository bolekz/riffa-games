// src/app.ts

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csurf from '@dr.pogodin/csurf';
import session from 'express-session';
import 'express-async-errors';

// Middlewares personalizados
import { generalLimiter, sensitiveLimiter } from './middlewares/rateLimiters';
import errorHandler from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';

// Rotas
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/routes/user.routes';
import tournamentRoutes from './modules/tournament/routes/tournament.routes';
import paymentRoutes from './modules/payments/routes/payment.route';
import prizeClaimRoutes from './modules/prizeClaim/routes/prizeClaim.routes';
import webhookRoutes from './modules/webhook/routes/webhook.route';
import systemRoutes from './routes/system.routes';

const app: Express = express();

// --- Middlewares Globais --- //

// Segurança HTTP
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
}));

// Parsers e Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Sessão (necessário para CSRF)
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // altere para true em produção com HTTPS
    httpOnly: true,
    sameSite: 'lax',
  },
}));

// CSRF Token (⚠️ após cookie + session)
app.use(csurf({ cookie: true }));

// Rate Limiter global
app.use('/api', generalLimiter);

// Endpoint para fornecer CSRF token
app.get('/api/csrf-token', (req, res) => {
  if (typeof req.csrfToken !== 'function') {
    return res.status(500).json({
      success: false,
      message: 'Middleware CSRF não aplicado corretamente.',
    });
  }

  return res.status(200).json({
    success: true,
    csrfToken: req.csrfToken(),
  });
});

// Rotas públicas
app.use('/api', systemRoutes);
app.use('/api/webhooks', webhookRoutes);

// Rotas protegidas com rate limiter
app.use('/api/auth', sensitiveLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/claims', prizeClaimRoutes);

// Tratamento de rotas não encontradas
app.use(notFoundHandler);

// Middleware global de erro
app.use(errorHandler);

export default app;
