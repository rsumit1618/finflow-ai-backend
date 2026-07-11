import { uploadFile, deleteFile, getDownloadUrl } from '../../../services/s3Service.js';
import { successResponse } from '../../../utils/apiResponse.js';
import { createDocument, findUserDocuments, findDocumentById, deleteDocumentById } from '../../../repositories/documentRepository.js';
import { AppError } from '../../../utils/AppError.js';

export const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const s3Key = `users/${req.user.userId}/${Date.now()}-${req.file.originalname}`;
    await uploadFile(req.file.buffer, s3Key, req.file.mimetype);

    // For general uploads, we can still provide a signed URL immediately
    const signedUrl = await getDownloadUrl(s3Key);

    return successResponse(res, { url: signedUrl, fileName: s3Key }, 'File uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const handlePdfUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
    }

    const category = req.body.category || 'GENERAL';
    // Organize S3 path by category
    const safeCategory = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const s3Key = `documents/${req.user.userId}/${safeCategory}/${Date.now()}-${req.file.originalname}`;

    await uploadFile(req.file.buffer, s3Key, req.file.mimetype);

    // Save to Database
    const document = await createDocument({
      name: req.file.originalname,
      category: category.toUpperCase(),
      s3Key: s3Key,
      url: s3Key,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      userId: req.user.userId,
    });

    // Add a temporary signed URL for immediate view
    document.url = await getDownloadUrl(s3Key);

    return successResponse(res, document, 'PDF uploaded and saved successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getUserDocuments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category?.toUpperCase();

    const { documents, total } = await findUserDocuments(req.user.userId, { skip, take: limit, category });

    // Generate temporary signed URLs for each document
    const documentsWithUrls = await Promise.all(documents.map(async (doc) => {
      return {
        ...doc,
        url: await getDownloadUrl(doc.s3Key)
      };
    }));

    return successResponse(res, {
      documents: documentsWithUrls,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, 'Documents fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const handleFileDelete = async (req, res, next) => {
  try {
    const { fileName } = req.body;

    // Security check: Ensure the user is only deleting their own files
    // The path structure is users/{userId}/... or documents/{userId}/...
    const pathParts = fileName.split('/');
    if (pathParts[1] !== req.user.userId.toString()) {
      throw new AppError('Unauthorized: You can only delete your own files', 403);
    }

    await deleteFile(fileName);
    return successResponse(res, null, 'File deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteUserDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const documentId = parseInt(id);

    // 1. Find document and verify ownership
    const document = await findDocumentById(documentId, req.user.userId);
    if (!document) {
      throw new AppError('Document not found or access denied', 404);
    }

    // 2. Delete from S3
    await deleteFile(document.s3Key);

    // 3. Delete from Database
    await deleteDocumentById(documentId, req.user.userId);

    return successResponse(res, null, 'Document deleted successfully');
  } catch (error) {
    next(error);
  }
};
