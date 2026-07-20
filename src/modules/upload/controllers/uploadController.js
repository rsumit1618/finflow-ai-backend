import { successResponse } from '../../../utils/apiResponse.js';
import {
  uploadMultipleVideos,
  listUserVideos,
  getSingleVideo,
  deleteVideo,
  uploadVideoThumbnailImage,
} from '../services/uploadService.js';

/**
 * POST /api/upload/videos
 * Upload 1–5 video files. Max total size: 500MB.
 * S3 path: {userId}/videos/{timestamp}-{originalname}
 */
export const handleMultipleVideoUpload = async (req, res, next) => {
  try {
    const result = await uploadMultipleVideos(req.files, req.user.userId);
    return successResponse(
      res,
      result,
      `${result.totalUploaded} video(s) uploaded successfully`,
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/upload/videos
 * List all user videos with pagination (10 per page), sorted by newest first.
 */
export const getUserVideos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await listUserVideos(req.user.userId, { page, limit });
    return successResponse(res, result, 'Videos fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/upload/videos/:id
 * Get a single video by ID with presigned URLs for video and thumbnail.
 */
export const getVideoById = async (req, res, next) => {
  try {
    const videoId = parseInt(req.params.id);
    const video = await getSingleVideo(videoId, req.user.userId);
    return successResponse(res, video, 'Video fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/upload/videos/:id
 * Delete a video (soft delete + remove from S3 + thumbnail cleanup).
 */
export const deleteUserVideo = async (req, res, next) => {
  try {
    const videoId = parseInt(req.params.id);
    await deleteVideo(videoId, req.user.userId);
    return successResponse(res, null, 'Video deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/upload/videos/:id/thumbnail
 * Upload a thumbnail image (JPEG/PNG/WebP) for a video.
 */
export const uploadVideoThumbnail = async (req, res, next) => {
  try {
    const videoId = parseInt(req.params.id);
    const result = await uploadVideoThumbnailImage(videoId, req.user.userId, req.file);
    return successResponse(res, result, 'Thumbnail uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
};

