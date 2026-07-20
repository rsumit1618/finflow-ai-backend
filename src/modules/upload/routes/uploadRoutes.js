import express from 'express';
import multer from 'multer';
import {
  handleMultipleVideoUpload,
  getUserVideos,
  getVideoById,
  deleteUserVideo,
  uploadVideoThumbnail,
} from '../controllers/uploadController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { ALLOWED_VIDEO_EXTENSIONS } from '../validators/uploadValidator.js';

const router = express.Router();

// Video upload (max 5 files, max 500MB total)
const videoUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB per file
  },
  fileFilter: (_req, file, cb) => {
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
    if (ALLOWED_VIDEO_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid video format. Allowed: ${ALLOWED_VIDEO_EXTENSIONS.join(', ')}`));
    }
  },
});

// Thumbnail upload (single image)
const thumbnailUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB for thumbnail
  },
  fileFilter: (_req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Thumbnail must be JPEG, PNG, or WebP format.'));
    }
  },
});

// ========== VIDEO ROUTES ==========

/**
 * @swagger
 * /upload/videos:
 *   post:
 *     summary: Upload 1–5 video files (max 500MB total). Supports MP4, MKV, WebM, AVI, MOV, WMV, FLV, OGV, 3GP, MPEG
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 minItems: 1
 *                 maxItems: 5
 *     responses:
 *       201:
 *         description: Videos uploaded successfully
 *       400:
 *         description: Validation error
 */
router.post('/videos', authMiddleware, videoUpload.array('videos', 5), handleMultipleVideoUpload);

/**
 * @swagger
 * /upload/videos:
 *   get:
 *     summary: Get all user videos with pagination (10 per page), sorted by newest first
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Videos fetched successfully
 */
router.get('/videos', authMiddleware, getUserVideos);

/**
 * @swagger
 * /upload/videos/{id}:
 *   get:
 *     summary: Get a single video by ID with presigned URLs
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Video fetched successfully
 *       404:
 *         description: Video not found
 */
router.get('/videos/:id', authMiddleware, getVideoById);

/**
 * @swagger
 * /upload/videos/{id}:
 *   delete:
 *     summary: Delete a video (removes from S3 + soft delete)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Video deleted successfully
 */
router.delete('/videos/:id', authMiddleware, deleteUserVideo);

/**
 * @swagger
 * /upload/videos/{id}/thumbnail:
 *   post:
 *     summary: Upload a thumbnail image (JPEG/PNG/WebP) for a video
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Thumbnail uploaded successfully
 */
router.post('/videos/:id/thumbnail', authMiddleware, thumbnailUpload.single('thumbnail'), uploadVideoThumbnail);

export default router;

