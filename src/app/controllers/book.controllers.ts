import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { FilterQuery } from 'mongoose';
import { Book, BookDocument } from '../models/book.model';
import { sendResponse } from '../utils/sendResponse';

export const booksRouter = express.Router();

// ✅ Zod Schema for validation
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

// ✅ Partial Schema for update
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

// ✅ Get all books with filter, sort, and pagination
booksRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      filter,
      sortBy = 'createdAt',
      sort = 'desc',
      limit,
      page = '1',
    } = req.query;

    const query: FilterQuery<BookDocument> = filter ? { genre: filter as string } : {};

    const pageNum = parseInt(page as string, 10);
    const limitNum = limit ? parseInt(limit as string, 10) : 0;

    // মোট বইয়ের সংখ্যা (filter অনুযায়ী)
    const totalBooks = await Book.countDocuments(query);

    // Query তৈরি ও sort করা
    let booksQuery = Book.find(query).sort({ [sortBy as string]: sort === 'asc' ? 1 : -1 });

    if (limitNum > 0) {
      const skip = (pageNum - 1) * limitNum;
      // **অবশ্যই reassignment করবেন**
      booksQuery = booksQuery.skip(skip).limit(limitNum);
    }

    const books = await booksQuery.exec();

    const totalPages = limitNum > 0 ? Math.ceil(totalBooks / limitNum) : 1;

    sendResponse(res, {
      data: books,
      totalPages,
      currentPage: pageNum,
      totalBooks,
    }, 'Books retrieved successfully');
  } catch (error) {
    next(error);
  }
});




// ✅ Get a single book by ID
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

// ✅ Update a book by ID
booksRouter.put('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = bookUpdateSchema.parse(req.body);

    // Logic: Auto-update `available` status based on `copies`
    if (body.copies === 0) {
      body.available = false;
    } else if (body.copies && body.copies > 0) {
      body.available = true;
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

// ✅ Delete a book by ID
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
