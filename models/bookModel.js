import mongoose from 'mongoose';

// define the Schema

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    read: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform(doc, ret) {
        // Delete the properties on the 'ret' object explicitly
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

// bookSchema.index({ genre: 1 });
// bookSchema.index({ author: 1 });
// bookSchema.index({ title: 'text' });

// create a Model

const BookModel = mongoose.model('book', bookSchema);

// Another way of creating index after creating schema
// await BookModel.createIndexes({ genre: 1, author: 1, title: 'text' });

export { BookModel };
