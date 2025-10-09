import {Router} from "express"
import { verifyJWT } from "../middleware/auth.js"
import { verifyAdmin } from "../middleware/admin.js"
import { approveUser, createApprover, getPendingCreators, rejectUser } from "../controllers/admin.controller.js"
import { validate } from '../middleware/validator.js';
import { registerSchema } from "../zod/user.schema.js";

const router = Router()

router.use(verifyJWT,verifyAdmin)
router.route("/:id/approve").patch(approveUser)
router.route("/:id/approve").patch(rejectUser)
router.route("/approver").post(validate(registerSchema),createApprover)
router.route("/creators").get(getPendingCreators)

export default router