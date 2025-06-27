import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

export const globalErrorHandler: ErrorRequestHandler = (err, req, res) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e: mongoose.Error.ValidatorError | mongoose.Error.CastError) => e.message)
      .join(', ');
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.statusCode && err.message) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: err,
  });
};
