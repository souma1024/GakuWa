import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import fs from "fs/promises";
import { Readable } from "stream";
import { avatarUrlGenerator } from '../utils/minioUrlGenerator';
import { imageRepository } from '../repositories/imageRepository';
import { userRepository } from '../repositories/userRepository';
import { ApiError } from '../errors/apiError';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  ...(process.env.AWS_ENDPOINT && {
    endpoint: process.env.AWS_ENDPOINT,
    forcePathStyle: true, // MinIO用
  }),
});

const BUCKET = process.env.S3_BUCKET_NAME!;

export const imageService = {
  async uploadImage(file: Express.Multer.File, userId: bigint): Promise<string> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError('not_found', 'ユーザーが見つかりませんでした。');
    }
    const handle: string = user.handle;

    const key = avatarUrlGenerator(handle);
    const objectKey = await imageRepository.insertAvatarUrl(key, handle);

    const fileBuffer = await fs.readFile(file.path);
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: file.mimetype,
    }));

    await fs.unlink(file.path);
    return objectKey;
  },

  async getImageStream(key: string, handle: string): Promise<{ stream: Readable; contentType: string }> {
    const response = await s3.send(new GetObjectCommand({
      Bucket: BUCKET,
      Key: handle + '/' + key,
    }));
    return {
      stream: response.Body as Readable,
      contentType: response.ContentType || 'image/*',
    };
  },

  async getDefaultAvatarImage(key: string): Promise<{ stream: Readable; contentType: string }> {
    const response = await s3.send(new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }));
    return {
      stream: response.Body as Readable,
      contentType: response.ContentType || 'image/*',
    };
  }
}