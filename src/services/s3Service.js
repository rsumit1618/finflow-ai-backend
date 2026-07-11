import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/s3.js';
import { env } from '../config/env.js';

const BUCKET_NAME = env.S3_BUCKET_NAME;

export const uploadFile = async (fileBuffer, fileName, contentType) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `https://${BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${fileName}`;
};

export const deleteFile = async (fileName) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
  });

  await s3Client.send(command);
  return true;
};