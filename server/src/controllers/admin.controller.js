import prisma from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import bcrypt from "bcrypt"

const ALLOWED_STATUS = ["active", "suspended"];
const ALLOWED_ROLES = ["creator", "approver"];

export const getAllUsersForAdmin = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const q = req.query.q ? String(req.query.q).trim() : null;
  const rawStatus = req.query.status ? String(req.query.status).trim() : null;
  const rawRole = req.query.role ? String(req.query.role).trim() : null;

  const where = {
    // ✅ Always exclude admin and pending users
    NOT: [
      { role: "admin" },
      { status: "pending" },
    ],
  };

  // 🔍 Search (by fullName or email)
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  // 🎯 Status filter (only allowed non-pending statuses)
  if (rawStatus) {
    const statuses = rawStatus.split(",").map((s) => s.trim()).filter(Boolean);
    const valid = statuses.filter((s) => ALLOWED_STATUS.includes(s));
    if (valid.length === 0) {
      throw new ApiError(400, `Invalid status filter. Allowed: ${ALLOWED_STATUS.join(", ")}`);
    }
    where.status = valid.length === 1 ? valid[0] : { in: valid };
  }

  // 🧩 Role filter (approver / creator)
  if (rawRole) {
    const roles = rawRole.split(",").map((s) => s.trim()).filter(Boolean);
    const valid = roles.filter((r) => ALLOWED_ROLES.includes(r));
    if (valid.length === 0) {
      throw new ApiError(400, `Invalid role filter. Allowed: ${ALLOWED_ROLES.join(", ")}`);
    }
    where.role = valid.length === 1 ? valid[0] : { in: valid };
  }

  // 📊 Total count
  const total = await prisma.user.count({ where });

  // 📋 Fetch users
  const users = await prisma.user.findMany({
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
      _count: {
        select: {
          createdPurchaseOrders: true,
          reviewedPurchaseOrders: true,
        },
      },
    },
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        meta: { total, page, limit, totalPages },
      },
      "Users fetched successfully"
    )
  );
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

export const approveUser = asyncHandler(async (req, res) => {
 console.log("Here at")
  const caller = req.user;
console.log("caller here",caller)
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

export const updateUserStatus = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const { status } = req.body;
  if (!["active", "suspended"].includes(status)) {
    throw new ApiError(400, "Invalid status. Must be 'active' or 'suspended'.");
  }

  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!user) throw new ApiError(404, "User not found.");
  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: { status },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { user: updatedUser }, `User status updated to '${status}'`));
});