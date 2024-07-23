import { PrismaClient } from '@prisma/client';
import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception'; 

const prisma = new PrismaClient();

export const getPosts = async (c: Context) => {
  try {
      const posts = await prisma.post.findMany({
        include: {
          author: {
            select: { id: true, name: true, email: true, role: true }
          },
          comments: true,
        },
      });
      return c.json(posts);
  } catch (error) {
      console.error('Error fetching posts:', error);
      return c.json({ error: 'Failed to fetch books' }, 500);
  } finally {
      await prisma.$disconnect();
  }
};

export const getPostById = async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id'), 10); 
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: true,
      },
    });
    if (!post) {
      throw new HTTPException(404, {message: 'Post not found'});
    }
    return c.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return c.json({ error: 'Failed to fetch post' }, 500);
  } finally {
    await prisma.$disconnect();
  }
};

export const createPost = async (c: Context) => {
  const { title, content, authorId } = await c.req.json(); // Parse request body

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: parseInt(authorId),
      }
    });
    return c.json(post, 201); // Created status code
  } catch (error) {
    console.error('Error creating post:', error);
    return c.json({ error: 'Failed to create post' }, 500);
  } finally {
    await prisma.$disconnect();
  }
};

export const updatePost = async (c: Context) => {
  try {
    const data = await c.req.json(); // Parse request body
    const id = parseInt(c.req.param('id'), 10); 
    const post = await prisma.post.update({
      where: { id },
      data,
    });
    if (!post) {
      throw new HTTPException(404, {message: 'Post not found'});
    }
    return c.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return c.json({ error: 'Failed to update post' }, 500);
  } finally {
    await prisma.$disconnect();
  }
};

export const deletePost = async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id'), 10); 
    await prisma.post.delete({
      where: {
        id
      },
    });
    return c.json({ message: 'Post deleted' }, 204);
  } catch (error) {
    console.error('Error deleting post:', error);
    return c.json({ error: 'Failed to delete post' }, 500);
  } finally {
    await prisma.$disconnect();
  }
};