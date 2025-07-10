import { Model } from 'mongoose';

export interface IBook {
  title: string;
  author: string;
  genre: 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY';
  isbn: string;
  description?: string;
  copies: number;
  available?: boolean;
  image?: string; 
}

export interface BookModel extends Model<IBook> {
  updateAvailability(bookId: string): Promise<void>;
}