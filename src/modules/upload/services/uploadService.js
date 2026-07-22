import { uploadFile, deleteFile, getPresignedUrl } from '../../../services/s3Service.js';
import {
  createVideo,
  findUserVideos,
  findVideoById,
  softDeleteVideo,
  updateVideo,
} from '../../../repositories/videoRepository.js';
import { AppError } from '../../../utils/AppError.js';
import {
  ALLOWED_VIDEO_EXTENSIONS,
  getFileExtension,
  MAX_VIDEO_FILES,
  MAX_VIDEO_TOTAL_BYTES,
} from '../validators/uploadValidator.js';

// ═══════════════════════════════════════════
//  VIDEO SERVICE METHODS
// ═══════════════════════════════════════════

/**
 * Upload multiple video files to S3 and save metadata to DB.
 * @param {Array<Express.Multer.File>} files - Array of video files
 * @param {string} userId
 * @returns {Promise<{videos: Array, totalUploaded: number}>}
 */
export const uploadMultipleVideos = async (files, userId) => {
  if (!files || files.length === 0) {
    throw new AppError('No video files uploaded', 400);
  }

  if (files.length > MAX_VIDEO_FILES) {
    throw new AppError(`You can upload a maximum of ${MAX_VIDEO_FILES} videos at a time`, 400);
  }

  // Validate each file extension
  for (const file of files) {
    const ext = getFileExtension(file.originalname);
    if (!ALLOWED_VIDEO_EXTENSIONS.includes(ext)) {
      throw new AppError(
        `Invalid video format: "${file.originalname}". Allowed formats: ${ALLOWED_VIDEO_EXTENSIONS.join(', ')}`,
        400
      );
    }
  }

  // Validate total file size
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > MAX_VIDEO_TOTAL_BYTES) {
    const maxMB = MAX_VIDEO_TOTAL_BYTES / (1024 * 1024);
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
    throw new AppError(
      `Total file size (${totalMB}MB) exceeds the maximum allowed (${maxMB}MB)`,
      400
    );
  }

  const uploadResults = [];

  for (const file of files) {
    const ext = getFileExtension(file.originalname);
    const format = ext.replace('.', '');
    const timestamp = Date.now();
    const s3Key = `${userId}/videos/${timestamp}-${file.originalname}`;

    // Upload file buffer to S3
    try {
      await uploadFile(file.buffer, s3Key, file.mimetype);
    } catch (s3Error) {
      console.error(`S3 Upload Error for ${file.originalname}:`, s3Error);
      throw new AppError(`Failed to upload "${file.originalname}" to storage`, 500);
    }

    // Get presigned URL for immediate access
    const s3Url = await getPresignedUrl(s3Key);

    // Save to database
    try {
      const video = await createVideo({
        userId,
        fileName: file.originalname,
        fileSize: file.size,
        s3Key,
        s3Url,
        mimeType: file.mimetype,
        format,
      });

      uploadResults.push({
        id: video.id,
        fileName: video.fileName,
        fileSize: video.fileSize,
        format: video.format,
        mimeType: video.mimeType,
        createdAt: video.createdAt,
        url: s3Url,
      });
    } catch (dbError) {
      console.error(`Database Error for ${file.originalname}:`, dbError);
      throw new AppError(`Failed to save video metadata for "${file.originalname}"`, 500);
    }
  }

  return { videos: uploadResults, totalUploaded: uploadResults.length };
};

/**
 * List user's videos with pagination, sorted by newest first.
 * Generates fresh presigned URLs for video playback and thumbnails.
 */
export const listUserVideos = async (userId, { page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const { videos, total } = await findUserVideos(userId, { skip, take: limit });

  const videosWithUrls = await Promise.all(
    videos.map(async (video) => {
      const playUrl = await getPresignedUrl(video.s3Key);
      let thumbnailUrl = null;
      if (video.thumbnailKey) {
        thumbnailUrl = await getPresignedUrl(video.thumbnailKey);
      }
      return { ...video, url: playUrl, thumbnailUrl };
    })
  );

  return {
    videos: videosWithUrls,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single video by ID with fresh presigned URLs.
 */
export const getSingleVideo = async (videoId, userId) => {
  const video = await findVideoById(videoId, userId);
  if (!video) {
    throw new AppError('Video not found or access denied', 404);
  }

  const playUrl = await getPresignedUrl(video.s3Key);
  let thumbnailUrl = null;
  if (video.thumbnailKey) {
    thumbnailUrl = await getPresignedUrl(video.thumbnailKey);
  }

  return { ...video, url: playUrl, thumbnailUrl };
};

/**
 * Delete a video: remove from S3 + soft-delete DB record.
 */
export const deleteVideo = async (videoId, userId) => {
  const video = await findVideoById(videoId, userId);
  if (!video) {
    throw new AppError('Video not found or access denied', 404);
  }

  // Delete video file from S3
  await deleteFile(video.s3Key);

  // Delete thumbnail from S3 if exists
  if (video.thumbnailKey) {
    await deleteFile(video.thumbnailKey);
  }

  // Soft delete from database
  await softDeleteVideo(videoId, userId);
};

/**
 * Upload a thumbnail image for a specific video.
 */
export const uploadVideoThumbnailImage = async (videoId, userId, file) => {
  if (!file) {
    throw new AppError('No thumbnail image uploaded', 400);
  }

  const video = await findVideoById(videoId, userId);
  if (!video) {
    throw new AppError('Video not found or access denied', 404);
  }

  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedImageTypes.includes(file.mimetype)) {
    throw new AppError('Thumbnail must be JPEG, PNG, or WebP format', 400);
  }

  // Upload thumbnail to S3
  const thumbnailKey = `thumbnails/${userId}/${videoId}/${Date.now()}-${file.originalname}`;
  await uploadFile(file.buffer, thumbnailKey, file.mimetype);
  const thumbnailUrl = await getPresignedUrl(thumbnailKey);

  // Update video record with thumbnail info
  const updatedVideo = await updateVideo(videoId, { thumbnailKey, thumbnailUrl });

  return {
    id: updatedVideo.id,
    thumbnailKey: updatedVideo.thumbnailKey,
    thumbnailUrl,
  };
};

