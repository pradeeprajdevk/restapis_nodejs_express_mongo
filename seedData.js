import mongoose from 'mongoose';
import { BookModel } from './models/index.js';

// connect to MongoDB
mongoose
  .connect(`mongodb://localhost:27017/books_service`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB', err));

// Sample Data
const books = [
  { title: 'Book One', author: 'Author A', genre: 'Fiction', read: true },
  { title: 'Book Two', author: 'Author B', genre: 'Non-Fiction', read: true },
];

// inset Mock data to DB
BookModel.insertMany(books)
  .then(() => {
    console.log('Mock data seeded!');
    mongoose.connection.close();
  })
  .catch((err) => console.error('Could not seed the Database!!!', err));
