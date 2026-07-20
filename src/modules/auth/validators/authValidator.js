import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50).optional(),
  lastName: z.string().trim().max(50).optional(),
  age: z.number().int().min(1).max(150).optional(),
  college: z.string().trim().max(200).optional(),
  qualificationYear: z.number().int().min(1900).max(2099).optional(),
  address: z.string().trim().max(500).optional(),
  highestQualification: z.string().trim().max(100).optional(),
  profileImage: z.string().trim().max(500).optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Old password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(20, "Refresh token is required"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(20, "Refresh token is required"),
});
