import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { getCookie } from 'hono/cookie';
import { bearerAuth } from 'hono/bearer-auth';
import { cors } from 'hono/cors'

// routes 
import bookRoutes from './routes/BookRoute';
import userRoutes from './routes/UserRoute';
import authRoutes from './routes/AuthRoute';
import postRoutes from './routes/PostRoute';
import { HTTPException } from 'hono/http-exception';
import { verify, decode } from 'hono/jwt';
import { PrismaClient } from '@prisma/client';
// ===========

const prisma = new PrismaClient();
const app = new Hono();

app.use(logger())

app.use('/*', cors({
    origin: 'http://localhost:5173', // Atur origin sesuai dengan aplikasi React Anda
  }));


// Middleware untuk memverifikasi token JWT
app.use("/verify", async (c, next) => {
    try {
      const authHeader = c.req.header('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HTTPException(401, { message: 'Authorization header missing or invalid' });
      }
      
      const token = authHeader.substring(7);
      
      const decoded = await verify(token, Bun.env.SECRET || ''); 
      
      const userEmail: any = decoded.email; 
      console.log("user email: ", userEmail)
      
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });
      console.log("user email: ", user)
  
      if (!user) {
        throw new HTTPException(401, { message: 'User not found' });
      }
  
      // Jika token valid dan user ditemukan, kirimkan respons berhasil
      return c.json({ message: 'Token verified successfully' });
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new HTTPException(401, { message: 'Unauthorized' });
    } finally {
      // return next()
      await prisma.$disconnect();
    }
  });

app.use("/index/*", bearerAuth({
    verifyToken: async (token, c) => {
        return token === getCookie(c, 'token')
    }
}))

app.route('/auth', authRoutes);
app.route('/api/books', bookRoutes);
app.route('/api/users', userRoutes);
app.route('/api/posts', postRoutes);

export default app