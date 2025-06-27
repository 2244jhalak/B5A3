import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, min: [1, 'Must borrow at least 1 book'] },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const Borrow = mongoose.model('Borrow', borrowSchema);