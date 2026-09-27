import "server-only";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UpstreamError, ValidationError } from "@/lib/errors";

const REGION = process.env.S3_REGION ?? "ap-south-1";
const BUCKET = process.env.S3_BUCKET;
const PUBLIC_URL = process.env.S3_FILE_URL; // e.g. CloudFront/CDN base

export const isS3Configured = Boolean(
  BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
);

let client: S3Client | null = null;
function s3(): S3Client {
  if (!isS3Configured) throw new UpstreamError("File storage");
  if (!client) {
    client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
      },
      ...(process.env.S3_ENDPOINT ? { endpoint: process.env.S3_ENDPOINT, forcePathStyle: true } : {}),
    });
  }
  return client;
}

const FOLDERS = ["products", "blog", "doctors", "reviews", "documents"] as const;
export type UploadFolder = (typeof FOLDERS)[number];

const CONTENT_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
  "video/mp4": ".mp4",
};

/** Presigned PUT for direct browser uploads (15-min expiry) + resulting public URL. */
export async function createUploadUrl(params: {
  folder: UploadFolder;
  contentType: string;
  filename: string;
}): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  if (!FOLDERS.includes(params.folder)) throw new ValidationError("Unknown folder");
  const ext = CONTENT_TYPES[params.contentType];
  if (!ext) throw new ValidationError("Unsupported content type");

  const safeName = params.filename.toLowerCase().replace(/[^a-z0-9-_]/g, "-").slice(0, 60);
  const key = `${params.folder}/${Date.now().toString(36)}-${safeName}${safeName.endsWith(ext) ? "" : ext}`;

  const uploadUrl = await getSignedUrl(
    s3(),
    new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: params.contentType }),
    { expiresIn: 900 }
  );

  const publicUrl = PUBLIC_URL
    ? `${PUBLIC_URL.replace(/\/$/, "")}/${key}`
    : `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

  return { uploadUrl, key, publicUrl };
}

/** Presigned GET for private documents (invoices, COAs). */
export async function createDownloadUrl(key: string, expiresIn = 300): Promise<string> {
  return getSignedUrl(s3(), new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn });
}
