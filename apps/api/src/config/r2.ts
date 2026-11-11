import { S3Client } from '@aws-sdk/client-s3';

function readConfig() {
  const {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
    R2_PUBLIC_URL,
    R2_UPLOAD_PREFIX,
  } = process.env;

  return {
    accountId: R2_ACCOUNT_ID,
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    bucket: R2_BUCKET_NAME,
    publicUrl: R2_PUBLIC_URL?.replace(/\/$/, ''),
    prefix: (R2_UPLOAD_PREFIX || 'uploads').replace(/^\/+|\/+$/g, ''),
  };
}

export const r2Config = readConfig();

export function getR2Config() {
  return readConfig();
}

export function isR2Configured(): boolean {
  const cfg = readConfig();
  return Boolean(cfg.accountId && cfg.accessKeyId && cfg.secretAccessKey && cfg.bucket && cfg.publicUrl);
}

let client: S3Client | null = null;
let clientKey: string | null = null;

export function getR2Client(): S3Client {
  const cfg = readConfig();
  if (!isR2Configured()) {
    throw new Error('Cloudflare R2 is not configured');
  }
  const key = `${cfg.accountId}:${cfg.accessKeyId}:${cfg.secretAccessKey}`;
  if (!client || clientKey !== key) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: cfg.accessKeyId!,
        secretAccessKey: cfg.secretAccessKey!,
      },
    });
    clientKey = key;
  }
  return client;
}
