
import { Request, Response } from 'express';

export const notFoundHandler = (
  req: Request, 
  res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API Not Found',
    error: {
      path: req.originalUrl,
      method: req.method,
    },
  });
};
