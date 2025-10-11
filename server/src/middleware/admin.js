import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized. No user found in request.");
  }

  if (user.role !== "admin") {
    throw new ApiError(403, "Forbidden. Only admins can perform this action.");
  }
console.log("Yup that's an admin")
  next();
});