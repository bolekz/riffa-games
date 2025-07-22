// src/routes/csrf.routes.ts

import { Router, Request, Response } from 'express';

const router = Router();

router.get('/csrf-token', (req: Request, res: Response) => {
  const token = req.csrfToken?.();

  if (!token) {
    console.error('⚠️ req.csrfToken não está disponível!');
    return res.status(500).json({ success: false, message: 'CSRF token indisponível.' });
  }

  return res.status(200).json({ success: true, csrfToken: token });
});

export { router as csrfRoutes };