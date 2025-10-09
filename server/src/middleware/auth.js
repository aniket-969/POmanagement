import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import prisma from "../db/index.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request. Token is missing.");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Unauthorized request. Token has expired.");
    } else {
      throw new ApiError(401, "Unauthorized request. Invalid token.");
    }
  }

  const userIdRaw = decodedToken?.id ?? decodedToken?._id;
  const userId = Number(userIdRaw);

  if (!userId || Number.isNaN(userId)) {
    throw new ApiError(401, "Unauthorized request. Invalid user id in token.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "Unauthorized request. User not found.");
  }

  req.user = user;
  next();
});
 