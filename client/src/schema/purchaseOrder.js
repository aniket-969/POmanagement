import {z} from "zod"
import { stringValidation } from './../utils/customValidator';

export const createPurchaseOrderSchema = z.object({
  title: stringValidation(3, 100, "Title"),
  description: z
    .string()
    .max(200, { message: "Description must be no more than 500 characters long." })
    .optional()
    .or(z.literal("")),
 total_amount: z.preprocess(
  (val) => (val === "" ? undefined : Number(val)), 
  z
    .number({
      required_error: "Total amount is required.",
      invalid_type_error: "Total amount must be a number.",
    })
    .positive({ message: "Total amount must be a positive number." })
    .refine((val) => val <= 10000000, {
      message: "Total amount is too large.",
    })
),

});