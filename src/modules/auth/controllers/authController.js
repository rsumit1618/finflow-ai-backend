import { successResponse } from "../../../utils/apiResponse.js";
import {
  changePasswordSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  updateProfileSchema,
} from "../validators/authValidator.js";

import {
  changePasswordService,
  getProfileService,
  getQualificationsService,
  loginUserService,
  logoutAllUserSessionsService,
  logoutUserService,
  refreshTokenService,
  registerUserService,
  updateProfileService,
} from "../services/authService.js";

export const registerUser = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await registerUserService(validatedData);
    return successResponse(res, result, "User registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await loginUserService(validatedData);
    return successResponse(res, result, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const validatedData = refreshTokenSchema.parse(req.body);
    const result = await refreshTokenService(validatedData.refreshToken);
    return successResponse(res, result, "Token refreshed successfully");
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await getProfileService(req.user.userId);
    return successResponse(res, { user }, "Profile fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    const user = await updateProfileService(req.user.userId, validatedData);
    return successResponse(res, { user }, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const validatedData = changePasswordSchema.parse(req.body);
    await changePasswordService(req.user.userId, validatedData);
    return successResponse(res, null, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const validatedData = logoutSchema.parse(req.body);
    await logoutUserService(validatedData.refreshToken);
    return successResponse(res, null, "Logout successful");
  } catch (error) {
    next(error);
  }
};

export const logoutAllUserSessions = async (req, res, next) => {
  try {
    await logoutAllUserSessionsService(req.user.userId);
    return successResponse(res, null, "Logged out from all sessions");
  } catch (error) {
    next(error);
  }
};

export const getQualifications = async (req, res, next) => {
  try {
    const qualifications = await getQualificationsService();
    return successResponse(res, { qualifications }, "Qualifications fetched successfully");
  } catch (error) {
    next(error);
  }
};
