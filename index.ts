import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { getCookie } from 'hono/cookie';
import { bearerAuth } from 'hono/bearer-auth';

// routes 
import bookRoutes from './routes/BookRoute';
import userRoutes from './routes/UserRoute';
import authRoutes from './routes/AuthRoute';
import postRoutes from './routes/PostRoute';
// ===========

const app = new Hono();

app.use(logger())

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