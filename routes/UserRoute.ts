import { Hono } from 'hono';
import { createUser, getUserAll, getUserDetail, deleteUser, updateUser } from '../controllers/UserController';

const userRoutes = new Hono();

userRoutes.post('/', createUser);
userRoutes.get('/', getUserAll);
userRoutes.get('/:id', getUserDetail);
userRoutes.put('/:id', updateUser);
userRoutes.delete('/:id', deleteUser);

export default userRoutes;
