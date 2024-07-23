import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';
import { PrismaClient } from '@prisma/client';

const app = new Hono();

const prisma = new PrismaClient();

export const Login = async (c: Context) => {
  const { email, password } = await c.req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !await Bun.password.verify(password, user.password)) {
    throw new HTTPException(401, { message: 'Invalid credentials' });
  }

  const payload = {
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const token = await sign(payload, Bun.env.SECRET || '');

  setCookie(c, 'token', token);

  return c.json({
    // payload,
    token,
  });
};

export const Logout = async (c: Context) => {
  const token = c.req.header('Cookie')?.split('=')?.[1];
  if (!token) {
    return c.json({ message: 'You are not logged in' });
  }

  setCookie(c, 'token', '', { expires: new Date(0) });

  return c.json({ message: 'Logged out successfully' });
};