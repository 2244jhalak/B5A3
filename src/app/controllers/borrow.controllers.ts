import express, { Request, Response } from "express";
import { z } from 'zod';

export const borrowRouter= express.Router();

const borrowZodSchema = z.object({
  book: z.string({ required_error: 'Book ID is required' }),
  quantity: z.number().min(1, 'Must borrow at least 1 book'),
  dueDate: z.string({ required_error: 'Due date is required' }),
});
