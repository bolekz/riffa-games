// src/middlewares/validateRequest.ts

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { generateResponse } from '../utils/responseHandler';

const validateRequest = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors[0]?.message || 'Erro de validação nos dados de entrada.';
        return res.status(400).json(generateResponse(false, errorMessage));
      }
      return next(error);
    }
  };

export default validateRequest;