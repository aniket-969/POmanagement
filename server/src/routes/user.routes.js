import {Router} from "express"
import { login, logout, registerUser } from "../controllers/user.controller.js"
import { validate } from '../middleware/validator.js';
import { loginSchema, registerSchema } from './../zod/user.schema.js';
import { verifyJWT } from './../middleware/auth.js';

const router = Router()

router.route("/register").post(validate(registerSchema),registerUser)
router.route("/login").post(validate(loginSchema),login)
router.route("/logout").post(verifyJWT,logout)
 
export default router