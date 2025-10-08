import bcrypt from "bcrypt";
import prisma from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const isPasswordCorrect = async (plainPassword, passwordHash) => {
  if (!passwordHash) return false;
  return bcrypt.compare(plainPassword, passwordHash);
};

export const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    // include passwordHash only for auth flows
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      status: true,
      passwordHash: true,  
      createdAt: true,
      updatedAt: true,
    },
  });
};

const createAccessToken = (payload) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
  return jwt.sign(payload, secret, { expiresIn });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
// console.log(req.body)

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email.");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      email,
      fullName,
      passwordHash,
      role: "creator",
      status: "pending",
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  res.status(201).json({
    success: true,
    message:
      "Registration successful. Please wait for admin approval before logging in.",
    user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await getUserByEmail(email);

  if (!user) {
    throw new ApiError(401, "Invalid credentials.");
  }

  if (user.status === "pending") {
    throw new ApiError(403, "Account pending approval. Please wait for admin approval.");
  }
  if (user.status === "suspended") {
    throw new ApiError(403, "Account suspended. Contact administrator.");
  }
  if (user.status !== "active") {
    throw new ApiError(403, `Account not allowed to login (status: ${user.status}).`);
  }

  const validPassword = await isPasswordCorrect(password, user.passwordHash);
  if (!validPassword) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const payload = { id: user.id, role: user.role, email: user.email };
  const accessToken = createAccessToken(payload);
const cookieOptions = {
  httpOnly: true,
  secure:true,
  path: "/", 
};
 return res
  .cookie("accessToken", accessToken, cookieOptions)
  .json(new ApiResponse(200, { user: safeUser }, "Login successful"));
});