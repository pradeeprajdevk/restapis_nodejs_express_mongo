import Joi from 'joi';
import { BookModel } from '../models/index.js';

//joi schema for query validation
const querySchema = Joi.object({
  genre: Joi.string().min(2).max(50).optional().messages({
    'string.base': 'Genre must be a string.',
    'string.min': 'Genre must have atleast 2 characters',
    'string.max': 'Genre must not exceed 50 characters',
  }),
  author: Joi.string().min(2).max(50).optional().messages({
    'string.base': 'Author must be a string.',
    'string.min': 'Author must have atleast 2 characters',
    'string.max': 'Author must not exceed 50 characters',
  }),
  title: Joi.string().min(2).max(50).optional().messages({
    'string.base': 'Title must be a string.',
  }),
});

export const GetBooks = async (req, res) => {
  try {
    // Validate the query params using joi
    const { error, value } = querySchema.validate(req.query, {
      abortEarly: false,
    });

    if (error) {
      // send error response with validation details
      return res.status(400).json({
        success: false,
        message: 'Validation failed!',
        errors: error.details.map((err) => err.message),
      });
    }

    // initialize an empty query object
    const query = {};

    // destructure the query param from the request

    const { genre, author, title } = value;

    // dynamically add filters if a specific query  param exists

    if (genre) {
      query.genre = genre;
    }

    if (author) {
      query.author = author;
    }

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    const limit = parseInt(req.query.limit) || 10; // Default 10 items per page
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const skip = (page - 1) * limit;

    const books = await BookModel.find(query).limit(limit).skip(skip);

    // Add hypermedia links to each book
    const booksWithLinks = books.map((book) => ({
      ...book.toJSON(),
      links: [
        {
          rel: 'self',
          href: `${req.protocol}://${req.get('host')}/api/books/${book._id}`,
          method: 'GET',
        },
        {
          rel: 'update',
          href: `${req.protocol}://${req.get('host')}/api/books/${book._id}`,
          method: 'PUT',
        },
        {
          rel: 'delete',
          href: `${req.protocol}://${req.get('host')}/api/books/${book._id}`,
          method: 'DELETE',
        },
      ],
    }));

    // res.status(200).json({
    //   success: true,
    //   data: books,
    // });

    res.status(200).json({
      success: true,
      count: booksWithLinks.length,
      data: booksWithLinks,
      links: [
        {
          rel: 'create',
          href: `${req.protocol}://${req.get('host')}/api/books`,
          method: 'POST',
        },
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: 'Error while fetching books.',
    });
  }
};

export const GetBookById = async (req, res) => {
  try {
    // Extract the bookId from route param
    const { bookId } = req.params;

    // fetch the book from the databaese
    const book = await BookModel.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with id of ${bookId} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (err) {
    console.error('Error fetching books:', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the book.',
    });
  }
};

export const AddBook = async (req, res) => {
  try {
    const { title, author } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and author',
      });
    }

    // create a new book
    const newBook = new BookModel({ title, author });

    // Save to DB
    await newBook.save();

    res.status(201).json({
      success: true,
      message: 'Book Added!',
      data: newBook,
    });
  } catch (err) {
    console.error('Error adding book:', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while adding the book',
    });
  }
};

export const UpdateBook = async (req, res) => {
  try {
    // get bookId
    const { bookId } = req.params;

    // get the updated fields from req body
    const { title, author, genre } = req.body;

    // validate
    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, author',
      });
    }

    // find and update the book by ID

    const updatedBook = await BookModel.findByIdAndUpdate(
      bookId,
      { title, author, genre },
      { new: true, runValidators: true }
    );

    // if the book is not found
    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found. Please check the ID',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook,
    });
  } catch (err) {
    console.error('Error updating a book:', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the book',
    });
  }
};

export const PatchBook = async (req, res) => {
  try {
    // get bookId
    const { bookId } = req.params;

    // get updates
    const updates = req.body;

    // validate that there's at least one field to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update',
      });
    }

    // find and updateBook
    const updatedBook = await BookModel.findByIdAndUpdate(bookId, updates, {
      new: true,
      runValidators: true,
    });

    // if the book is not found
    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found. Please check the ID',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook,
    });
  } catch (err) {
    console.error('Error updating book:', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating a book',
    });
  }
};

export const DeleteBook = async (req, res) => {
  try {
    // get bookId
    const { bookId } = req.params;

    const deletedBook = await BookModel.findByIdAndDelete(bookId);

    // if the book is not found
    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found. Please check the ID',
      });
    }

    res.status(200).json({
      success: true,
      message: `Book with ID ${bookId} deleted successfully`,
    });
  } catch (err) {
    console.error('Error Deleting book:', err);
    return res.status(500).json({
      success: false,
      message: 'An occurred while deleting a book',
    });
  }
};
