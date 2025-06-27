import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { booksRouter } from './app/controllers/book.controllers';
import { borrowRouter } from './app/controllers/borrow.controllers';
import { notFoundHandler } from './app/middlewares/notFoundHandler';


const app: Application =express();

app.use(express.json());
app.use(cors());
app.use('/api/books', booksRouter);
app.use('/api/borrow', borrowRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.get('/',async (req: Request , res: Response)=>{
    res.json({message: 'Library Management API is running'});
});

export default app;

