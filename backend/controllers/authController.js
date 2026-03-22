// backend/controllers/authController.js

import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

/**
 * POST /api/v1/auth/sync
 * Called from frontend after Clerk sign-in.
 * Creates user in MongoDB if first time, otherwise returns existing user.
 * Public route — JWT is verified client-side by Clerk before calling this.
 */
const syncUser = asyncHandler(async (req, res) => {
  const { clerkId, name, email } = req.body;

  if (!clerkId || !name || !email) {
    res.status(400);
    throw new Error("clerkId, name, and email are required.");
  }

  // Upsert: find existing user or create new one
  const user = await User.findOneAndUpdate(
    { clerkId },
    { clerkId, name, email },
    {
      upsert: true,       // Create if not found
      new: true,          // Return updated document
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  ).select("-__v");

  const isNew = !user.createdAt || 
    (Date.now() - new Date(user.createdAt).getTime()) < 3000;

  res.status(isNew ? 201 : 200).json({
    success: true,
    message: isNew ? "User created successfully." : "User synced successfully.",
    data: user,
  });
});

/**
 * GET /api/v1/auth/me
 * Protected route — returns the currently authenticated user's profile.
 * req.user is attached by authMiddleware protect()
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

/**
 * PUT /api/v1/auth/me
 * Protected route — allows user to update their name.
 * Email and clerkId are immutable from this endpoint.
 */
const updateMe = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    res.status(400);
    throw new Error("Name is required and cannot be empty.");
  }

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { name: name.trim() },
    { new: true, runValidators: true }
  ).select("-__v");

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: updated,
  });
});

export { syncUser, getMe, updateMe };