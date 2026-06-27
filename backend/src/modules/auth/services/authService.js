import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../../../config/env.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  updateUserPassword,
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
    {
      userId: user.id,
      email: user.email,
      type: "access",
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );
};

const createRefreshTokenValue = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      type: "refresh",
    },
    env.jwtRefreshSecret,
    {
      expiresIn: env.jwtRefreshExpiresIn,
    }
  );
};

const createAuthTokens = async (user) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshTokenValue(user);

  await createRefreshToken({
    tokenHash: hashToken(refreshToken),
    userId: user.id,
    expiresAt: getRefreshExpiryDate(),
  });

  return {
    accessToken,
    refreshToken,
  };
};

const toPublicUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
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
    name: userData.name,
    email: userData.email,
    passwordHash,
  });

  const tokens = await createAuthTokens(user);

  return {
    user: toPublicUser(user),
    tokens,
  };
};

export const loginUserService = async (loginData) => {
  const user = await findUserByEmail(loginData.email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(
    loginData.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokens = await createAuthTokens(user);

  return {
    user: toPublicUser(user),
    tokens,
  };
};

export const refreshTokenService = async (refreshToken) => {
  let decoded;

  try {
    decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);
  } catch (_error) {
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

  const user = await findUserById(decoded.userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await revokeRefreshTokenByHash(tokenHash);

  const tokens = await createAuthTokens(user);

  return {
    user: toPublicUser(user),
    tokens,
  };
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
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return toPublicUser(user);
};

export const updateProfileService = async (userId, data) => {
  const user = await updateUserById(userId, {
    name: data.name,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    updatedAt: user.updatedAt,
  };
};

export const changePasswordService = async (userId, data) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isOldPasswordValid = await bcrypt.compare(
    data.oldPassword,
    user.passwordHash
  );

  if (!isOldPasswordValid) {
    throw new AppError("Old password is incorrect", 400);
  }

  const newPasswordHash = await bcrypt.hash(data.newPassword, 10);

  await updateUserPassword(userId, newPasswordHash);
  await revokeAllRefreshTokensForUser(userId);

  return true;
};