 import {Router} from "express"
import { approvePurchaseOrder, bulkUpdatePoStatus, createPurchaseOrder, getAllPurchaseOrders, getApproverOrders, getApproverReviewedOrders, getPurchaseOrderById, rejectPurchaseOrder, submitPurchaseOrder } from "../controllers/purchaseOrder.controller.js"
import { verifyJWT } from "../middleware/auth.js"
import { approvePurchaseOrderSchema, createPurchaseOrderSchema, rejectPurchaseOrderSchema,bulkUpdatePoStatusSchema } from "../zod/purchaseOrder.schema.js"
import { validate } from "../middleware/validator.js"
import { bulkUpdatePoStatus } from './../controllers/purchaseOrder.controller';

 const router = Router()

 router.use(verifyJWT)

 router.route("/").post(validate(createPurchaseOrderSchema),createPurchaseOrder)
 router.route("/:id/submit").patch(submitPurchaseOrder)
 router.route("/approver/:id/approve").patch(validate(approvePurchaseOrderSchema),approvePurchaseOrder)
 router.route("/approver/:id/reject").patch(validate(rejectPurchaseOrderSchema),rejectPurchaseOrder)
 router.route("/approver").get(getApproverOrders)
 router.route("/approver/review").get(getApproverReviewedOrders)
 router.route("/approver/batch/status").patch(
  validate(bulkUpdatePoStatusSchema),
  bulkUpdatePoStatus
);
 router.route("/").get(getAllPurchaseOrders)
 router.route("/:id").get(getPurchaseOrderById)

 export default router