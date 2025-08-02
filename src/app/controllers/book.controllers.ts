import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { FilterQuery } from 'mongoose';
import { Book, BookDocument } from '../models/book.model';
import { sendResponse } from '../utils/sendResponse';

export const booksRouter = express.Router();

// ✅ Zod Schema
const bookZodSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  author: z.string({ required_error: 'Author is required' }),
  genre: z.enum(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY']),
  isbn: z.string({ required_error: 'ISBN is required' }),
  description: z.string().optional(),
  copies: z.number().min(0, 'Copies must be a positive number'),
  available: z.boolean().optional(),
  image: z.string().url({ message: 'Must be a valid image URL' }).optional(),
});

// ✅ Partial Schema for Update
const bookUpdateSchema = bookZodSchema.partial();

// ✅ Custom Error Interface
interface CustomError extends Error {
  statusCode?: number;
}

// ✅ Create a new book
booksRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = bookZodSchema.parse(req.body);
    const newBook = await Book.create(body);
    sendResponse(res, newBook, 'Book created successfully');
  } catch (error) {
    next(error);
  }
});

// ✅ Get all books with pagination, filter, sort
booksRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      filter,
      sortBy = 'createdAt',
      sort = 'desc',
      limit = '10',
      page = '1',
    } = req.query;

    const query: FilterQuery<BookDocument> = filter
      ? { genre: filter as string }
      : {};

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limitNum);

    sendResponse(res, books, 'Books retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// ✅ Get book by ID
booksRouter.get('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      const error = new Error('Book not found') as CustomError;
      error.statusCode = 404;
      throw error;
    }
    sendResponse(res, book, 'Book retrieved successfully');
  } catch (error) {
    next(error);
  }
});

booksRouter.put('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = bookUpdateSchema.parse(req.body); // Validate incoming data

    // copies 0 হলে available false সেট করো
    if (body.copies === 0) {
      body.available = false;
    }

    const book = await Book.findByIdAndUpdate(
      req.params.bookId,
      { $set: body },
      { new: true }
    );

    if (!book) {
      const error = new Error('Book not found') as CustomError;
      error.statusCode = 404;
      throw error;
    }

    sendResponse(res, book, 'Book updated successfully');
  } catch (error) {
    next(error);
  }
});


// ✅ Delete book by ID
booksRouter.delete('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.bookId);
    if (!deleted) {
      const error = new Error('Book not found') as CustomError;
      error.statusCode = 404;
      throw error;
    }
    sendResponse(res, null, 'Book deleted successfully');
  } catch (error) {
    next(error);
  }
});
