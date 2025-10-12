import prisma from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generatePoNumber } from "../utils/helper.js";

const ALLOWED_STATUSES = ["draft","submitted","approved","rejected"];

export const createPurchaseOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  if (user.role !== "creator") {
    throw new ApiError(403, "Only users with role 'creator' can create purchase orders.");
  }

  const { title, description = null, total_amount } = req.body;

  const totalAmount = typeof total_amount !== "undefined" ? total_amount : req.body.totalAmount;

  if (typeof totalAmount === "undefined") {
    throw new ApiError(400, "totalAmount is required.");
  }

  const poNumber = generatePoNumber();

  const createdPo = await prisma.$transaction(async (tx) => {
    const po = await tx.purchaseOrder.create({
      data: {
        poNumber,          
        title,
        description,
        totalAmount,       
        status: "draft", 
        createdById: user.id 
      },
    });

    await tx.poHistory.create({
      data: {
        poId: po.id,                 
        userId: user.id,              
        action: "created",
        description: `Purchase order created (poNumber: ${poNumber})`,
      },
    });

    return po;
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { purchaseOrder: createdPo }, "Purchase order created"));
});

export const submitPurchaseOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  const rawId = req.params.id;
  const id = isNaN(Number(rawId)) ? rawId : Number(rawId);

  const po = await prisma.purchaseOrder.findUnique({
    where: { id },
  });

  if (!po) {
    throw new ApiError(404, "Purchase order not found.");
  }

  if (po.createdById !== user.id) {
    throw new ApiError(403, "Only the creator of this purchase order can submit it.");
  }

  if (po.status !== "draft") {
    throw new ApiError(
      400,
      `Only purchase orders with status 'draft' can be submitted. Current status: ${po.status}`
    );
  }

  const updatedPo = await prisma.$transaction(async (tx) => {
    const upd = await tx.purchaseOrder.update({
      where: { id },
      data: {
        status: "submitted",
        submittedAt: new Date(), 
      },
    });

    await tx.poHistory.create({
      data: {
        poId: upd.id,
        userId: user.id,
        action: "submitted",
        description: `Purchase order submitted by user ${user.id}`,
      },
    });

    return upd;
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { purchaseOrder: updatedPo }, "Purchase order submitted"));
});

export const approvePurchaseOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  const rawId = req.params.id;
  const id = isNaN(Number(rawId)) ? rawId : Number(rawId);

  if (!["approver"].includes(user.role)) {
    throw new ApiError(403, "Only approver can approve purchase orders.");
  }

  const po = await prisma.purchaseOrder.findUnique({ where: { id } });
  if (!po) throw new ApiError(404, "Purchase order not found.");

  if (po.status !== "submitted") {
    throw new ApiError(400, `Only 'submitted' POs can be approved. Current status: ${po.status}`);
  }

  const { reviewComment =null} = req.body;

  const updatedPo = await prisma.$transaction(async (tx) => {
    const upd = await tx.purchaseOrder.update({
      where: { id },
      data: {
        status: "approved",
        reviewedAt: new Date(),
        reviewedById: user.id,
      },
    });

    await tx.poHistory.create({
      data: {
        poId: upd.id,
        userId: user.id,
        action: "approved",
        description: reviewComment
          ? `Approved by user ${user.id}: ${reviewComment}`
          : `Approved by user ${user.id}`,
      },
    });

    return upd;
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { purchaseOrder: updatedPo }, "Purchase order approved"));
});

export const rejectPurchaseOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  const rawId = req.params.id;
  const id = isNaN(Number(rawId)) ? rawId : Number(rawId);

  if (!user) throw new ApiError(401, "Unauthorized");

  if (!["approver", "admin"].includes(user.role)) {
    throw new ApiError(403, "Only approver or admin can reject purchase orders.");
  }

  const po = await prisma.purchaseOrder.findUnique({ where: { id } });
  if (!po) throw new ApiError(404, "Purchase order not found.");

  if (po.status !== "submitted") {
    throw new ApiError(400, `Only 'submitted' POs can be rejected. Current status: ${po.status}`);
  }

  const { reviewComment } = req.body;

  const updatedPo = await prisma.$transaction(async (tx) => {
    const upd = await tx.purchaseOrder.update({
      where: { id },
      data: {
        status: "rejected",
        reviewedAt: new Date(),
        reviewedById: user.id,
      },
    });

    await tx.poHistory.create({
      data: {
        poId: upd.id,
        userId: user.id,
        action: "rejected",
        description: reviewComment
          ? `Rejected by user ${user.id}: ${reviewComment}`
          : `Rejected by user ${user.id}`,
      },
    });

    return upd;
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { purchaseOrder: updatedPo }, "Purchase order rejected"));
});

export const getPurchaseOrderById = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  const rawId = req.params.id;
  const id = isNaN(Number(rawId)) ? rawId : Number(rawId);

  const po = await prisma.purchaseOrder.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, fullName: true, email: true } },
      reviewedBy: { select: { id: true, fullName: true, email: true } },
      poHistory: {
        orderBy: { createdAt: "asc" },
        select: { id: true, action: true, description: true, userId: true, createdAt: true },
      },
    },
  });

  if (!po) throw new ApiError(404, "Purchase order not found.");

  if (user.role === "creator" && po.createdById !== user.id) {
    throw new ApiError(403, "You do not have permission to view this purchase order.");
  }

  return res.status(200).json(new ApiResponse(200, { purchaseOrder: po }, "Purchase order fetched"));
});

export const getAllPurchaseOrders = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const rawStatus = req.query.status ? String(req.query.status).trim() : null;
  const q = req.query.q ? String(req.query.q).trim().slice(0, 200) : null; 
  const skip = (page - 1) * limit;

  const where = {};

  if (user.role === "creator") {
    where.createdById = user.id;
  } else if (user.role === "approver" || user.role === "admin") {
  } else {
    throw new ApiError(403, "You do not have permission to view purchase orders.");
  }

  if (rawStatus) {
    const list = rawStatus.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const filtered = list.filter(s => ALLOWED_STATUSES.includes(s));
    if (filtered.length === 0) {
      throw new ApiError(400, `Invalid status. Allowed: ${ALLOWED_STATUSES.join(",")}`);
    }
    where.status = filtered.length === 1 ? filtered[0] : { in: filtered };
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { poNumber: { contains: q, mode: "insensitive" } },
    ];
  }

  const totalCount = await prisma.purchaseOrder.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    const data = await prisma.purchaseOrder.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    select: {
      id: true,
      poNumber: true,
      title: true,
      description: true,
      totalAmount: true,
      status: true,
      createdAt: true,
      submittedAt: true,
      reviewedAt: true,
      createdBy: { select: { id: true, fullName: true, email: true } },
      reviewedBy: { select: { id: true, fullName: true, email: true } },

      poHistory: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          action: true,
          description: true,
          comment: true,
          createdAt: true,
          user: { select: { id: true, fullName: true, email: true } },
        },
      },
    },
  });


  return res.status(200).json(new ApiResponse(200, {
    data, page, limit, totalCount, totalPages
  }, "Purchase orders fetched"));
});

export const getApproverOrders = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");
  if (!["approver", "admin"].includes(user.role)) {
    throw new ApiError(403, "Only approver or admin can access this endpoint.");
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const q = req.query.q ? String(req.query.q).trim().slice(0,200) : null;
  const view = req.query.view ? String(req.query.view).toLowerCase() : "pending"; // pending | handled
  const rawStatus = req.query.status ? String(req.query.status).trim() : null;
  const skip = (page - 1) * limit;

  const where = {};

  if (view === "pending") {
    where.status = "submitted";
  } else if (view === "handled") {
    where.reviewedById = user.id;
    where.status = { in: ["approved", "rejected"] };
  } else {
    throw new ApiError(400, "Invalid view. Allowed: 'pending' or 'handled'.");
  }

  if (rawStatus) {
    const list = rawStatus.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const filtered = list.filter(s => ALLOWED_STATUSES.includes(s));
    if (filtered.length === 0) {
      throw new ApiError(400, `Invalid status. Allowed: ${ALLOWED_STATUSES.join(",")}`);
    }
    where.status = filtered.length === 1 ? filtered[0] : { in: filtered };
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { poNumber: { contains: q, mode: "insensitive" } },
    ];
  }

  const totalCount = await prisma.purchaseOrder.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const data = await prisma.purchaseOrder.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    select: {
      id: true,
      poNumber: true,
      title: true,
      totalAmount: true,
      status: true,
      createdAt: true,
      submittedAt: true,
      reviewedAt: true,
      createdBy: { select: { id: true, fullName: true, email: true } },
      reviewedBy: { select: { id: true, fullName: true, email: true } },

      // <-- include poHistory here (recent first), and include the user who made the history entry
      poHistory: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          action: true,
          description: true,
          comment: true,
          createdAt: true,
          user: { select: { id: true, fullName: true, email: true } },
        },
      },
    },
  });

  return res.status(200).json(new ApiResponse(200, { data, page, limit, totalCount, totalPages }, "Approver orders fetched"));
});

