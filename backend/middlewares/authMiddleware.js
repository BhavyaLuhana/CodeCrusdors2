// backend/middleware/authMiddleware.js

import { createClerkClient } from "@clerk/backend";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * Protect routes — verifies Clerk session token from Authorization header.
 * Attaches `req.auth` (Clerk payload) and `req.user` (MongoDB user doc).
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Authorization token missing or malformed.");
  }

  const token = authHeader.split(" ")[1];

  // Verify token with Clerk SDK
  const payload = await clerkClient.verifyToken(token);

  if (!payload || !payload.sub) {
    res.status(401);
    throw new Error("Invalid or expired token.");
  }

  // Attach Clerk payload to request
  req.auth = payload;

  // Look up the MongoDB user by clerkId
  const user = await User.findOne({ clerkId: payload.sub }).select(
    "-__v"
  );

  if (!user) {
    res.status(401);
    throw new Error(
      "User not found. Please complete sign-in to sync your account."
    );
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Your account has been deactivated. Contact support.");
  }

  // Attach MongoDB user to request for downstream use
  req.user = user;

  next();
});

/**
 * Restrict access to admin role only.
 * Must be used AFTER `protect` middleware.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403);
  throw new Error("Access denied. Admins only.");
};

export { protect, adminOnly };