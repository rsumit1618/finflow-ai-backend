import prisma from "../config/prisma.js";
import crypto from "crypto";

export const generateUserId = () => {
  return crypto.randomBytes(8).toString("hex"); // 16 char hex string
};

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const findUserByUserId = async (userId) => {
  return await prisma.user.findUnique({
    where: { userId },
  });
};

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: {
      userId: generateUserId(),
      ...userData,
    },
  });
};

export const updateUserById = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const updateUserPassword = async (id, passwordHash) => {
  return await prisma.user.update({
    where: { id },
    data: { passwordHash },
  });
};

// ─── Profile ───

export const findProfileByUserId = async (userId) => {
  return await prisma.profile.findUnique({
    where: { userId },
  });
};

export const upsertProfile = async (userId, data) => {
  return await prisma.profile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
};

// ─── Qualification ───

export const findAllQualifications = async () => {
  return await prisma.qualification.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });
};
