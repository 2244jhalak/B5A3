import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Book } from '../models/book.model';
import { Borrow } from '../models/borrow.model';
import { sendResponse } from '../utils/sendResponse';

export const borrowRouter = express.Router();


const borrowZodSchema = z.object({
  book: z.string({ required_error: 'Book ID is required' }),
  quantity: z.number().min(1, 'Must borrow at least 1 book'),
  dueDate: z.string({ required_error: 'Due date is required' }), 
});


borrowRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { book, quantity, dueDate } = borrowZodSchema.parse(req.body); 
    const bookRecord = await Book.findById(book);
    console.log(bookRecord);
      
    
    if (!bookRecord || bookRecord.copies < quantity) {
      throw new Error('Not enough copies available');
    }

    bookRecord.copies -= quantity;
    await bookRecord.save();

    await Book.updateAvailability(book);

    const borrowRecord = await Borrow.create({
      book,
      quantity,
      dueDate: new Date(dueDate), 
    });

    sendResponse(res, borrowRecord, 'Book borrowed successfully');
  } catch (error) {
    next(error); 
  }
});

borrowRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await Borrow.aggregate([
  {
    $group: {
      _id: '$book',
      totalQuantity: { $sum: '$quantity' },
    },
  },
  {
    $lookup: {
      from: 'books',
      localField: '_id',
      foreignField: '_id',
      as: 'book',
    },
  },
  { $unwind: '$book' },
  {
    $project: {
      _id: 0,
      book: {
        title: '$book.title',
        isbn: '$book.isbn',
      },
      totalQuantity: 1,
    },
  },
]);
    sendResponse(res, summary, 'Borrowed books summary retrieved successfully');
  } catch (error) {
    next(error);
  }
});
