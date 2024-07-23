import { Hono } from 'hono';
import { getBooks, getBook, createBook, updateBook, deleteBook } from '../controllers/BookController';

const bookRoutes = new Hono();

bookRoutes.get('/', getBooks);
bookRoutes.get('/:id', getBook);
bookRoutes.post('/', createBook);
bookRoutes.put('/:id', updateBook);
bookRoutes.delete('/:id', deleteBook);

export default bookRoutes;
