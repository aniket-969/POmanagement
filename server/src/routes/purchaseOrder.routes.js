 import {Router} from "express"
import { approvePurchaseOrder, createPurchaseOrder, getAllPurchaseOrders, getApproverOrders, getPurchaseOrderById, rejectPurchaseOrder, submitPurchaseOrder } from "../controllers/purchaseOrder.controller.js"
import { verifyJWT } from "../middleware/auth.js"
import { approvePurchaseOrderSchema, createPurchaseOrderSchema, rejectPurchaseOrderSchema } from "../zod/purchaseOrder.schema.js"
import { validate } from "../middleware/validator.js"

 const router = Router()

 router.use(verifyJWT)

 router.route("/").post(validate(createPurchaseOrderSchema),createPurchaseOrder)
 router.route("/:id/submit").patch(submitPurchaseOrder)
 router.route("/approver/:id/approve").patch(validate(approvePurchaseOrderSchema),approvePurchaseOrder)
 router.route("/approver/:id/reject").patch(validate(rejectPurchaseOrderSchema),rejectPurchaseOrder)
 router.route("/approver").get(getApproverOrders)
 router.route("/").get(getAllPurchaseOrders)
 router.route("/:id").get(getPurchaseOrderById)

 export default router