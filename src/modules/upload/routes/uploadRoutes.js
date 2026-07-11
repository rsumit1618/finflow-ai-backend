import express from 'express';
import multer from 'multer';
import { handleFileUpload, handleFileDelete, handlePdfUpload, getUserDocuments } from '../controllers/uploadController.js';
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

router.post('/upload', authMiddleware, upload.single('file'), handleFileUpload);
router.post('/pdf', authMiddleware, pdfUpload.single('file'), handlePdfUpload);
router.get('/documents', authMiddleware, getUserDocuments);
router.delete('/file', authMiddleware, validate(deleteFileSchema), handleFileDelete);

export default router;
