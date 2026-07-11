import { uploadFile, deleteFile } from '../../../services/s3Service.js';
import { successResponse } from '../../../utils/apiResponse.js';
import { createDocument, findUserDocuments } from '../../../repositories/documentRepository.js';

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

export const handlePdfUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
    }

    const s3Key = `documents/${req.user.userId}/${Date.now()}-${req.file.originalname}`;
    const url = await uploadFile(req.file.buffer, s3Key, req.file.mimetype);

    // Save to Database
    const document = await createDocument({
      name: req.file.originalname,
      s3Key: s3Key,
      url: url,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      userId: req.user.userId,
    });

    return successResponse(res, document, 'PDF uploaded and saved successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getUserDocuments = async (req, res, next) => {
  try {
    const documents = await findUserDocuments(req.user.userId);
    return successResponse(res, documents, 'Documents fetched successfully');
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
