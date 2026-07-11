import express from 'express';
import multer from 'multer';
import { handleFileUpload, handleFileDelete } from '../controllers/uploadController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { validate } from '../../../middlewares/validate.js';
import { deleteFileSchema } from '../validators/uploadValidator.js';

const router = express.Router();

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Optional: add allowed mime types here
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and PDF are allowed.'));
    }
  },
});

router.post('/upload', authMiddleware, upload.single('file'), handleFileUpload);
router.delete('/file', authMiddleware, validate(deleteFileSchema), handleFileDelete);

export default router;
