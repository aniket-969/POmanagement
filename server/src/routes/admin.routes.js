import {Router} from "express"
import { verifyJWT } from "../middleware/auth.js"
import { verifyAdmin } from "../middleware/admin.js"
import { approveUser, createApprover, getAllUsersForAdmin, getPendingCreators, rejectUser, updateUserStatus } from "../controllers/admin.controller.js"
import { validate } from '../middleware/validator.js';
import { registerSchema } from "../zod/user.schema.js";

const router = Router()
 
router.use(verifyJWT,verifyAdmin)
router.route("/:id/approve").patch(approveUser)
router.route("/:id/reject").patch(rejectUser)
router.route("/approver").post(validate(registerSchema),createApprover)
router.route("/creators").get(getPendingCreators)
router.route("/users").get(getAllUsersForAdmin)
router.route("/:id/status").patch(updateUserStatus);

export default router