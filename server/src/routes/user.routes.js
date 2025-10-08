import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import { validate } from '../middleware/validator.js';
import { registerSchema } from './../zod/user.schema.js';

const router = Router()

router.route("/register").post(validate(registerSchema),registerUser)

export default router