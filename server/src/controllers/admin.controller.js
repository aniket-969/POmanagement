import prisma from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"

export const approveUser = asyncHandler(async (req, res) => {
 
  const caller = req.user;

  const userId = Number(req.params.id);
  if (!userId || Number.isNaN(userId)) {
    throw new ApiError(400, "Invalid user id.");
  } 

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, fullName: true, role: true, status: true, createdAt: true, updatedAt: true },
  });

  if (!target) {
    throw new ApiError(404, "User not found.");
  }

  if (target.role !== "creator") {
    throw new ApiError(400, "Only users with role 'creator' can be approved via this endpoint.");
  }

  if (target.status !== "pending") {
    throw new ApiError(400, `User status must be 'pending' to approve. Current status: ${target.status}`);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status: "active" },
    select: { id: true, email: true, fullName: true, role: true, status: true, createdAt: true, updatedAt: true },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { user: updated }, "User approved successfully."));
});

export const rejectUser = asyncHandler(async (req, res) => {
  const caller = req.user;
  const userId = Number(req.params.id);

  if (!userId || Number.isNaN(userId)) {
    throw new ApiError(400, "Invalid user id.");
  }

  const target = await prisma.user.findUnique({
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

  if (!target) {
    throw new ApiError(404, "User not found.");
  }

  if (target.role !== "creator") {
    throw new ApiError(
      400,
      "Only users with role 'creator' can be rejected via this endpoint."
    );
  }

  if (target.status !== "pending") {
    throw new ApiError(
      400,
      `User status must be 'pending' to reject. Current status: ${target.status}`
    );
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status: "suspended" },
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

  return res
    .status(200)
    .json(new ApiResponse(200, { user: updated }, "User rejected successfully."));
});


export const createApprover = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const approver = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: "approver",
      status: "active",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { user: approver }, "Approver created successfully."));
});

export const getPendingCreators = asyncHandler(async (req, res) => {

  const user = req.user;
console.log("here")
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const q = req.query.q ? String(req.query.q).trim().slice(0, 200) : null;
  const skip = (page - 1) * limit;

  const where = {
    status: "pending",
    role: "creator",
  };

  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { fullName: { contains: q, mode: "insensitive" } },
    ];
  }

  const totalCount = await prisma.user.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const data = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
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

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data, page, limit, totalCount, totalPages },
        "Pending creators fetched"
      )
    );
});