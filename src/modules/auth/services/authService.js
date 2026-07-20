import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../../../config/env.js";
import {
  createUser,
  findUserByEmail,
  findUserByUserId,
  findAllQualifications,
  updateUserById,
  updateUserPassword,
  findProfileByUserId,
  upsertProfile,
} from "../../../repositories/userRepository.js";
import {
  createRefreshToken,
  findActiveRefreshTokenByHash,
  revokeAllRefreshTokensForUser,
  revokeRefreshTokenByHash,
} from "../../../repositories/refreshTokenRepository.js";
import { AppError } from "../../../utils/AppError.js";

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const getRefreshExpiryDate = () => {
  const days = Number.parseInt(env.jwtRefreshExpiresIn, 10) || 30;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt;
};

const createAccessToken = (user) => {
  return jwt.sign(
    { userId: user.userId, email: user.email, type: "access" },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
};

const createRefreshTokenValue = (user) => {
  return jwt.sign(
    { userId: user.userId, email: user.email, type: "refresh" },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn }
  );
};

const createAuthTokens = async (user) => {
  const accessToken = createAccessToken(user);
  const refreshTokenValue = createRefreshTokenValue(user);

  await createRefreshToken({
    tokenHash: hashToken(refreshTokenValue),
    userId: user.userId,
    expiresAt: getRefreshExpiryDate(),
  });

  return { accessToken, refreshToken: refreshTokenValue };
};

const toPublicUser = (user, profile = null) => {
  return {
    userId: user.userId,
    email: user.email,
    profile: profile
      ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
          age: profile.age,
          college: profile.college,
          qualificationYear: profile.qualificationYear,
          address: profile.address,
          highestQualification: profile.highestQualification,
          profileImage: profile.profileImage,
        }
      : null,
    createdAt: user.createdAt,
  };
};

export const registerUserService = async (userData) => {
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);
  const user = await createUser({
    email: userData.email,
    passwordHash,
  });

  const tokens = await createAuthTokens(user);

  return { user: toPublicUser(user), tokens };
};

export const loginUserService = async (loginData) => {
  const user = await findUserByEmail(loginData.email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(loginData.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokens = await createAuthTokens(user);

  return { user: toPublicUser(user), tokens };
};

export const refreshTokenService = async (refreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  if (decoded.type !== "refresh") {
    throw new AppError("Invalid refresh token", 401);
  }

  const tokenHash = hashToken(refreshToken);
  const storedToken = await findActiveRefreshTokenByHash(tokenHash);
  if (!storedToken) {
    await revokeAllRefreshTokensForUser(decoded.userId);
    throw new AppError("Refresh token reuse detected", 401);
  }

  const user = await findUserByUserId(decoded.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  await revokeRefreshTokenByHash(tokenHash);
  const tokens = await createAuthTokens(user);

  return { user: toPublicUser(user), tokens };
};

export const logoutUserService = async (refreshToken) => {
  await revokeRefreshTokenByHash(hashToken(refreshToken));
  return true;
};

export const logoutAllUserSessionsService = async (userId) => {
  await revokeAllRefreshTokensForUser(userId);
  return true;
};

export const getProfileService = async (userId) => {
  const user = await findUserByUserId(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const profile = await findProfileByUserId(userId);
  return toPublicUser(user, profile);
};

export const updateProfileService = async (userId, data) => {
  const user = await findUserByUserId(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Update profile (upsert)
  const profileData = {};
  if (data.firstName !== undefined) profileData.firstName = data.firstName;
  if (data.lastName !== undefined) profileData.lastName = data.lastName;
  if (data.age !== undefined) profileData.age = data.age;
  if (data.college !== undefined) profileData.college = data.college;
  if (data.qualificationYear !== undefined) profileData.qualificationYear = data.qualificationYear;
  if (data.address !== undefined) profileData.address = data.address;
  if (data.highestQualification !== undefined) profileData.highestQualification = data.highestQualification;
  if (data.profileImage !== undefined) profileData.profileImage = data.profileImage;

  const profile = await upsertProfile(userId, profileData);

  return toPublicUser(user, profile);
};

export const changePasswordService = async (userId, data) => {
  const user = await findUserByUserId(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isOldPasswordValid = await bcrypt.compare(data.oldPassword, user.passwordHash);
  if (!isOldPasswordValid) {
    throw new AppError("Old password is incorrect", 400);
  }

  const newPasswordHash = await bcrypt.hash(data.newPassword, 10);
  await updateUserPassword(user.id, newPasswordHash);
  await revokeAllRefreshTokensForUser(userId);

  return true;
};

// ─── Qualifications ───

export const getQualificationsService = async () => {
  return await findAllQualifications();
};
