import prisma from "../config/prisma.js";

export const createDocument = async (data) => {
  return await prisma.document.create({
    data,
  });
};

export const findUserDocuments = async (userId) => {
  return await prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const findDocumentById = async (id, userId) => {
  return await prisma.document.findFirst({
    where: { id, userId },
  });
};

export const deleteDocumentById = async (id, userId) => {
  return await prisma.document.delete({
    where: { id, userId },
  });
};
