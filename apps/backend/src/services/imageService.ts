import * as Minio from 'minio'
import fs from "fs/promises";
import { Readable } from "stream";
import { avatarUrlGenerator } from '../utils/minioUrlGenerator';
import { imageRepository } from '../repositories/imageRepository';
import { userRepository } from '../repositories/userRepository';
import { ApiError } from '../errors/apiError';

const minio = new Minio.Client({
  endPoint: "minio", // コンテナ内用
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

const BUCKET = 'avatars'

export const imageService = {
  async uploadImage(file: Express.Multer.File, userId: bigint): Promise<string>  {  

    const exists = await minio.bucketExists(BUCKET);
    if (!exists) {
      await minio.makeBucket(BUCKET, "us-east-1");
      console.log("bucket作成");
    } 

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError('not_found', 'ユーザーが見つかりませんでした。');
    }
    const handle: string = user.handle

    const key = avatarUrlGenerator(handle);
    const objectKey = await imageRepository.insertAvatarUrl(key, handle);

    await minio.fPutObject(
      BUCKET,
      objectKey,
      file.path,
      { "Content-Type": file.mimetype }
    );

    await fs.unlink(file.path);
    console.log("成功だよ");
    return 'avatars/' + objectKey; 
  },

  async getImageStream(key: string, handle: string): Promise<{ stream: Readable; contentType: string }> {
    const stream = await minio.getObject('avatars', handle + '/' + key);
    return {
      stream,
      contentType: "image/*",
    };
  },

  async getDefaultAvatarImage(key: string): Promise<{ stream: Readable; contentType: string}> {
    const stream = await minio.getObject('avatars', key);
    return {
      stream,
      contentType: "image/*",
    }
  }
}