import express, { NextFunction, Request, Response } from "express";
import { z } from 'zod';
import { Book } from "../models/book.model";
import { sendResponse } from "../utils/sendResponse";

export const booksRouter= express.Router();

const bookZodSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  author: z.string({ required_error: 'Author is required' }),
  genre: z.enum(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY']),
  isbn: z.string({ required_error: 'ISBN is required' }),
  description: z.string().optional(),
  copies: z.number().min(0, 'Copies must be a positive number'),
  available: z.boolean().optional(),
});

// Create a new book
booksRouter.post("/api/books", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = bookZodSchema.parse(req.body); // Zod validation
    const newBook = await Book.create(body);
    sendResponse(res, newBook, 'Book created successfully');
  } catch (error) {
    next(error); // Global Error Handler এ যাবে
  }
});

// Get all books
booksRouter.get("/api/books", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filter, sortBy = 'createdAt', sort = 'desc', limit = '10' } = req.query;
    const query: any = filter ? { genre: filter } : {};
    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === 'asc' ? 1 : -1 })
      .limit(parseInt(limit as string));
    sendResponse(res, books, 'Books retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// Get book by ID
booksRouter.get("/api/books/:bookId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      const error = new Error("Book not found");
      (error as any).statusCode = 404;
      throw error;
    }
    sendResponse(res, book, 'Book retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// Update
booksRouter.patch("/api/books/:bookId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.bookId,
      { $set: req.body },
      { new: true }
    );

    if (!book) {
      const error = new Error('Book not found');
      (error as any).statusCode = 404;
      throw error;
    }

    sendResponse(res, book, 'Book updated successfully');
  } catch (error) {
    next(error);
  }
});

// Delete Book
booksRouter.delete("/api/books/:bookId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.bookId);
    if (!deleted) {
      const error = new Error('Book not found');
      (error as any).statusCode = 404;
      throw error;
    }
    sendResponse(res, null, 'Book deleted successfully');
  } catch (error) {
    next(error);
  }
});
