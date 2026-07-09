import prisma from "../config/prisma.js";

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const updateUserById = async (id, data) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
};

export const updateUserPassword = async (id, passwordHash) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      passwordHash,
    },
  });
};
