import { z } from 'zod';

// ─── Video Upload Helpers ───

export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/x-matroska',       // .mkv
  'video/webm',
  'video/avi',
  'video/quicktime',         // .mov
  'video/x-ms-wmv',          // .wmv
  'video/x-flv',             // .flv
  'video/ogg',               // .ogv
  'video/3gpp',              // .3gp
  'video/mpeg',              // .mpeg
];

export const ALLOWED_VIDEO_EXTENSIONS = [
  '.mp4', '.mkv', '.webm', '.avi', '.mov',
  '.wmv', '.flv', '.ogv', '.3gp', '.mpeg', '.mpg',
];

export const MAX_VIDEO_TOTAL_BYTES = 500 * 1024 * 1024; // 500MB
export const MAX_VIDEO_FILES = 5;

export const videoUploadSchema = z.object({
  description: z.string().max(500).optional(),
  tags: z.string().max(200).optional(),
});

export const getFileExtension = (filename) => {
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex === -1) return '';
  return filename.substring(dotIndex).toLowerCase();
};

export const isValidVideoFile = (file) => {
  const ext = getFileExtension(file.originalname);
  return ALLOWED_VIDEO_EXTENSIONS.includes(ext);
};

