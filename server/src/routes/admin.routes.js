import {Router} from "express"
import { verifyJWT } from "../middleware/auth.js"
import { verifyAdmin } from "../middleware/admin.js"
import { approveUser, createApprover } from "../controllers/admin.controller.js"
import { validate } from '../middleware/validator.js';
import { registerSchema } from "../zod/user.schema.js";

const router = Router()

router.use(verifyJWT)
router.route("/:id/approve").patch(verifyAdmin,approveUser)
router.route("/approver").post(validate(registerSchema),verifyAdmin,createApprover)

export default router