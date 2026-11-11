import crypto from 'crypto';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getR2Client, getR2Config, isR2Configured } from '../config/r2';
import { ApiError } from './ApiError';

export async function uploadImageToR2(file: Express.Multer.File): Promise<{ url: string; key: string }> {
  if (!isR2Configured()) {
    throw new ApiError(
      'Image upload is not configured. Please set Cloudflare R2 environment variables.',
      500,
      'R2_NOT_CONFIGURED'
    );
  }

  const ext = path.extname(file.originalname || '').toLowerCase();
  const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(ext) ? ext : '.jpg';
  const cfg = getR2Config();

  // S3 API endpoints require signed requests; public object URLs must use r2.dev or a custom domain.
  try {
    const host = new URL(cfg.publicUrl || '').hostname;
    if (host.endsWith('.r2.cloudflarestorage.com')) {
      throw new ApiError(
        'R2_PUBLIC_URL must be a public bucket URL (r2.dev subdomain or custom domain), not the S3 API endpoint. Enable Public Access (r2.dev) or connect a custom domain in Cloudflare R2 bucket settings and set R2_PUBLIC_URL to that URL.',
        500,
        'R2_PUBLIC_URL_INVALID'
      );
    }
  } catch (e) {
    if (e instanceof ApiError) throw e;
  }
  const key = `${cfg.prefix}/${new Date().getUTCFullYear()}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: cfg.bucket!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || 'application/octet-stream',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return {
    key,
    url: `${cfg.publicUrl}/${key}`,
  };
}
