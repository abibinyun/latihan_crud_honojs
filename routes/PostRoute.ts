import { Hono } from 'hono';
import { getPosts, createPost, deletePost, getPostById, updatePost } from '../controllers/PostController';
import { verifyBearerToken } from '../middleware/authMiddleware';

const postRoutes = new Hono();

postRoutes.get('/', getPosts);
postRoutes.post('/', verifyBearerToken, createPost);
postRoutes.get('/:id', getPostById);
postRoutes.put('/:id', verifyBearerToken, updatePost);
postRoutes.delete('/:id', verifyBearerToken, deletePost);

export default postRoutes;
