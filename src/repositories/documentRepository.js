import prisma from "../config/prisma.js";

export const createDocument = async (data) => {
  return await prisma.document.create({
    data,
  });
};

export const findUserDocuments = async (userId, { skip = 0, take = 10, category } = {}) => {
  const where = { userId };
  if (category) {
    where.category = category;
  }

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.document.count({ where }),
  ]);

  return { documents, total };
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
