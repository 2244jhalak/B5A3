import mongoose, { Schema, Model, Document } from 'mongoose';
import { IBook } from '../interfaces/book.interface';

export interface BookDocument extends IBook, Document {}

export interface BookModel extends Model<BookDocument> {
  updateAvailability(bookId: string): Promise<void>;
}

const genreEnum = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'];

const bookSchema = new Schema<BookDocument, BookModel>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true, enum: genreEnum },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: { type: Number, required: true, min: [0, 'Copies must be a positive number'] },
    available: { type: Boolean, default: true },
    image: { type: String, default: '' }
  },
  { timestamps: true, versionKey: false }
);

// ✅ Static Method
bookSchema.statics.updateAvailability = async function (bookId: string) {
  const book = await this.findById(bookId);
  if (book) {
    book.available = book.copies > 0;
    await book.save();
  }
};

// ✅ Pre-save Middleware
bookSchema.pre('save', function (next) {
  this.available = this.copies > 0;
  console.log(`[Pre-Save] Availability updated to: ${this.available}`);
  next();
});

// ✅ Post-save Middleware
bookSchema.post('save', function (doc, next) {
  console.log(`[Post-Save] Book saved: ${doc.title} | Copies: ${doc.copies}`);
  next();
});

export const Book = mongoose.model<BookDocument, BookModel>('Book', bookSchema);