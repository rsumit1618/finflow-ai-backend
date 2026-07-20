import prisma from "../config/prisma.js";

/**
 * Create a single video record in the database.
 * @param {Object} data - { userId, fileName, fileSize, s3Key, s3Url, mimeType, duration, resolution, format, thumbnailKey, thumbnailUrl }
 * @returns {Promise<Object>} Created video record
 */
export const createVideo = async (data) => {
  return await prisma.video.create({ data });
};

/**
 * Create multiple video records in a single transaction.
 * @param {Array<Object>} videosData - Array of video data objects
 * @returns {Promise<Array<Object>>} Created video records
 */
export const createManyVideos = async (videosData) => {
  return await prisma.$transaction(
    videosData.map((data) => prisma.video.create({ data }))
  );
};

/**
 * Find all videos for a user with pagination, sorted by newest first.
 * @param {string} userId
 * @param {Object} options - { skip, take }
 * @returns {Promise<{videos: Array, total: number}>}
 */
export const findUserVideos = async (userId, { skip = 0, take = 10 } = {}) => {
  const where = { userId, isActive: true };

  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.video.count({ where }),
  ]);

  return { videos, total };
};

/**
 * Find a single video by ID, scoped to user.
 * @param {number} id
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
export const findVideoById = async (id, userId) => {
  return await prisma.video.findFirst({
    where: { id, userId, isActive: true },
  });
};

/**
 * Soft-delete (deactivate) a video record.
 * @param {number} id
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const softDeleteVideo = async (id, userId) => {
  return await prisma.video.update({
    where: { id },
    data: { isActive: false },
  });
};

/**
 * Hard-delete a video record.
 * @param {number} id
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const deleteVideoById = async (id, userId) => {
  return await prisma.video.delete({
    where: { id },
  });
};

/**
 * Update video fields (e.g., thumbnail).
 * @param {number} id
 * @param {Object} data - Fields to update
 * @returns {Promise<Object>}
 */
export const updateVideo = async (id, data) => {
  return await prisma.video.update({
    where: { id },
    data,
  });
};

