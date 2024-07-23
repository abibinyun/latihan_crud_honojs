import { PrismaClient } from '@prisma/client';
import type { Context } from 'hono';

const prisma = new PrismaClient();

export const createUser = async (c: Context) => {
    try {
        const {name, email, password} = await c.req.json(); 
        const hash = await Bun.password.hash(password, {
            algorithm: "bcrypt",
            cost: 4,
          });

        const data: any = {
            name: name,
            email: email,
            password: hash
        }

        const user = await prisma.user.create({ data });
        return c.json(user, 201);
    } catch (error) {
        console.error('Error creating user:', error);
        return c.json({ error: 'Failed to create user' }, 500);
    } finally {
        await prisma.$disconnect();
    }
};

export const getUserAll = async (c: Context) => {
    try {
        const users = await prisma.user.findMany();
        return c.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return c.json({ error: 'Failed to fetch users' }, 500);
    } finally {
        await prisma.$disconnect();
    }
};

export const getUserDetail = async (c: Context) => {
    const userId = parseInt(c.req.param('id'), 10);

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (user) {
            return c.json(user);
        } else {
            return c.json({ error: 'User not found' }, 404);
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return c.json({ error: 'Internal Server Error' }, 500);
    } finally {
        await prisma.$disconnect();
    }
};

export const updateUser = async (c: Context) => {
    const userId = parseInt(c.req.param('id'), 10);
    const { name, email, password } = await c.req.json();
  
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }
  
      // Update user data
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: name || user.name,
          email: email || user.email,
          password: password ? await Bun.password.hash(password, { algorithm: "bcrypt", cost: 4 }) : undefined,
        },
      });
  
      return c.json(updatedUser, 200);
    } catch (error) {
      console.error('Error updating user:', error);
      return c.json({ error: 'Failed to update user' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  };

export const deleteUser = async (c: Context) => {
    const userId = parseInt(c.req.param('id'), 10);

    try {
        const deletedUser = await prisma.user.delete({
            where: {
                id: userId,
            },
        });

        return c.json({ message: `User with ID ${userId} has been deleted.`, deletedUser }, 200);
    } catch (error) {
        console.error('Error deleting user:', error);
        return c.json({ error: 'Internal Server Error' }, 500);
    } finally {
        await prisma.$disconnect();
    }
};