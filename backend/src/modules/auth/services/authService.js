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
import { AppError } from "../../../utils/AppError.js";

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

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
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

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
};

export const getProfileService = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
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

  return true;
};
