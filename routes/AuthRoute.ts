import { Hono } from 'hono';
import { Login, Logout,  } from '../controllers/AuthController';
import {zValidator} from "@hono/zod-validator"
import {z} from "zod"

const authRoutes = new Hono();

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

authRoutes.post("/login", zValidator('json', schema), Login);
authRoutes.post("/logout", Logout);
// authRoutes.get("/verify", Verify);

export default authRoutes;