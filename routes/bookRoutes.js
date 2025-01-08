import express from 'express';
import {
  AddBook,
  DeleteBook,
  GetBookById,
  GetBooks,
  PatchBook,
  UpdateBook,
} from '../controllers/index.js';

// create a router
const router = express.Router();

// GET router for /api/books
router.route('/books').get(GetBooks).post(AddBook);

router
  .route('/books/:bookId')
  .get(GetBookById)
  .put(UpdateBook)
  .patch(PatchBook)
  .delete(DeleteBook);

export { router as bookRouter };
