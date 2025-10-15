import { z } from "zod";
import { stringValidation } from "../utils/customValidator.js";

export const createPurchaseOrderSchema = z.object({
  title: stringValidation(3, 100, "Title"),
  description: z
    .string()
    .max(500, { message: "Description must be no more than 500 characters long." })
    .optional()
    .or(z.literal("")),
  total_amount: z
    .number({
      required_error: "Total amount is required.",
      invalid_type_error: "Total amount must be a number.",
    })
    .positive({ message: "Total amount must be a positive number." })
    .refine((val) => val <= 1000000000, {
      message: "Total amount is too large.",
    }), 

});

export const approvePurchaseOrderSchema = z.object({
  reviewComment: stringValidation(1, 500, "Review comment").optional(),
});

export const rejectPurchaseOrderSchema = z.object({
  reviewComment: stringValidation(1, 500, "Review comment"),
});


export const bulkUpdatePoStatusSchema = z.object({
  ids: z.array(z.preprocess((v) => Number(v), z.number().int().positive())).min(1),
  status: z.enum(["approved", "rejected"]),
  comment: z.string().min(1, "comment is required"),
});
