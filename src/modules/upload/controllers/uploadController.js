import { uploadFile, deleteFile } from '../../../services/s3Service.js';
import { successResponse } from '../../../utils/apiResponse.js';

export const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileName = `users/${req.user.userId}/${Date.now()}-${req.file.originalname}`;
    const url = await uploadFile(req.file.buffer, fileName, req.file.mimetype);

    return successResponse(res, { url, fileName }, 'File uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const handleFileDelete = async (req, res, next) => {
  try {
    const { fileName } = req.body;
    await deleteFile(fileName);
    return successResponse(res, null, 'File deleted successfully');
  } catch (error) {
    next(error);
  }
};
