import express from 'express';
import multer from 'multer';
import { handleFileUpload, handleFileDelete, handlePdfUpload, getUserDocuments, deleteUserDocument } from '../controllers/uploadController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { validate } from '../../../middlewares/validate.js';
import { deleteFileSchema } from '../validators/uploadValidator.js';

const router = express.Router();

// Generic upload (Images/PDFs)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and PDF are allowed.'));
    }
  },
});

// PDF specific upload with DB tracking
const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for this endpoint.'));
    }
  },
});

/**
 * @swagger
 * /upload/upload:
 *   post:
 *     summary: Upload a general file (Image/PDF)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */
router.post('/upload', authMiddleware, upload.single('file'), handleFileUpload);

/**
 * @swagger
 * /upload/pdf:
 *   post:
 *     summary: Upload a PDF document with category
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               category:
 *                 type: string
 *                 default: GENERAL
 *     responses:
 *       201:
 *         description: PDF uploaded and saved successfully
 */
router.post('/pdf', authMiddleware, pdfUpload.single('file'), handlePdfUpload);

/**
 * @swagger
 * /upload/documents:
 *   get:
 *     summary: Get user documents with pagination and category filter
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
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Documents fetched successfully
 */
router.get('/documents', authMiddleware, getUserDocuments);

/**
 * @swagger
 * /upload/documents/{id}:
 *   delete:
 *     summary: Delete a specific document
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
 *         description: Document deleted successfully
 */
router.delete('/documents/:id', authMiddleware, deleteUserDocument);

/**
 * @swagger
 * /upload/file:
 *   delete:
 *     summary: Delete a file from S3 by filename
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 */
router.delete('/file', authMiddleware, validate(deleteFileSchema), handleFileDelete);

export default router;
