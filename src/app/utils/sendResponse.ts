import { Response } from 'express';

export const sendResponse = <T>(
  res: Response,
  data: T,
  message: string,
  status = 200
): void => {
  res.status(status).json({ success: true, message, data });
};
