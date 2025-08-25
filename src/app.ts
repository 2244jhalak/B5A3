import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { booksRouter } from './app/controllers/book.controllers';
import { borrowRouter } from './app/controllers/borrow.controllers';
import { notFoundHandler } from './app/middlewares/notFoundHandler';


const app: Application =express();

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://leafy-two.vercel.app']
   })
);
app.use('/api/books', booksRouter);
app.use('/api/borrow', borrowRouter);

app.get('/',async (req: Request , res: Response)=>{
    res.json({message: 'B5A3 is running'});
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;

