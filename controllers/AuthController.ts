import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt';
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

// export const Verify = async (c: Context) => {
//   try {
//     const authHeader = c.req.header('authorization');
//     console.log("AUTH HEADER: ", authHeader)
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new HTTPException(401, { message: 'Authorization header missing or invalid' });
//     }
    
//     const token = authHeader.substring(7); // Mengambil bagian token setelah "Bearer "
//     console.log("TOKEN: ", token)
    
//     const decoded = await verify(token, Bun.env.SECRET || ''); // Verifikasi token menggunakan secret
    
//     console.log("DECODE: ", decoded)
    
//     const userEmail: any = decoded.email; // Dapatkan email dari payload token JWT

//     // Cek apakah email ada di database
//     const user = await prisma.user.findUnique({
//       where: { email: userEmail },
//     });

//     if (!user) {
//       throw new HTTPException(401, { message: 'User not found' });
//     }

//     // Jika token valid dan user ditemukan, kirimkan respons berhasil
//     c.json({ message: 'Token verified successfully' });
//   } catch (error) {
//     console.error('Token verification failed:', error);
//     throw new HTTPException(401, { message: 'Unauthorized' });
//   } finally {
//     await prisma.$disconnect();
//   }
// }