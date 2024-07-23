import type { Context } from 'hono';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBooks = async (c: Context) => {
    try {
        const books = await prisma.book.findMany();
        return c.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        return c.json({ error: 'Failed to fetch books' }, 500);
    } finally {
        await prisma.$disconnect();
    }
};

export const getBook = async (c: Context) => {
  const id = parseInt(c.req.param('id'), 10);

  try {
      const book = await prisma.book.findUnique({
          where: { id },
      });

      if (book) {
          return c.json(book);
      } else {
          return c.json({ error: 'Book not found' }, 404);
      }
  } catch (error) {
      console.error('Error fetching book:', error);
      return c.json({ error: 'Failed to fetch book' }, 500);
  } finally {
      await prisma.$disconnect();
  }
};

export const createBook = async (c: Context) => {
  try {
      const { title } = await c.req.json();
      const createdBook = await prisma.book.create({ data: { title } });
      return c.json(createdBook, 201);
  } catch (error) {
      console.error('Error creating book:', error);
      return c.json({ error: 'Failed to create book' }, 500);
  } finally {
      await prisma.$disconnect();
  }
};

export const updateBook = async (c: Context) => {
  const id = parseInt(c.req.param('id'), 10);
  const { title } = await c.req.json();

  try {
      const updatedBook = await prisma.book.update({
          where: { id },
          data: { title },
      });

      return c.json(updatedBook);
  } catch (error) {
      console.error('Error updating book:', error);
      return c.json({ error: 'Failed to update book' }, 500);
  } finally {
      await prisma.$disconnect();
  }
};

export const deleteBook = async (c: Context) => {
  const id = parseInt(c.req.param('id'), 10);

  try {
      const deletedBook = await prisma.book.delete({
          where: { id },
      });

      return c.json({ message: `Book with ID ${id} has been deleted.`, deletedBook });
  } catch (error) {
      console.error('Error deleting book:', error);
      return c.json({ error: 'Failed to delete book' }, 500);
  } finally {
      await prisma.$disconnect();
  }
};