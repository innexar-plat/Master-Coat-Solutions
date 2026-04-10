import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { environmentConfig } from "@/lib/env";

type StorageProvider = "cloudflare-r2" | "minio";

type UploadResult = {
  provider: StorageProvider;
  key: string;
  url: string;
};

function hasR2Config() {
  return Boolean(
    environmentConfig.CF_R2_ENDPOINT &&
      environmentConfig.CF_R2_ACCESS_KEY_ID &&
      environmentConfig.CF_R2_SECRET_ACCESS_KEY &&
      environmentConfig.CF_R2_BUCKET
  );
}

function hasMinioConfig() {
  return Boolean(
    environmentConfig.MINIO_ENDPOINT &&
      environmentConfig.MINIO_ACCESS_KEY &&
      environmentConfig.MINIO_SECRET_KEY &&
      environmentConfig.MINIO_BUCKET
  );
}

function getR2Client() {
  return new S3Client({
    endpoint: environmentConfig.CF_R2_ENDPOINT,
    region: "auto",
    credentials: {
      accessKeyId: environmentConfig.CF_R2_ACCESS_KEY_ID!,
      secretAccessKey: environmentConfig.CF_R2_SECRET_ACCESS_KEY!
    }
  });
}

function getMinioClient() {
  return new S3Client({
    endpoint: environmentConfig.MINIO_ENDPOINT,
    region: "us-east-1",
    forcePathStyle: true,
    credentials: {
      accessKeyId: environmentConfig.MINIO_ACCESS_KEY!,
      secretAccessKey: environmentConfig.MINIO_SECRET_KEY!
    }
  });
}

function safeBaseUrl(input: string | undefined) {
  if (!input) {
    return undefined;
  }

  return input.endsWith("/") ? input.slice(0, -1) : input;
}

function resolvePublicUrl(provider: StorageProvider, key: string): string {
  if (provider === "cloudflare-r2") {
    const baseUrl = safeBaseUrl(environmentConfig.CF_R2_PUBLIC_BASE_URL);
    if (baseUrl) {
      return `${baseUrl}/${key}`;
    }

    return `${environmentConfig.CF_R2_ENDPOINT}/${environmentConfig.CF_R2_BUCKET}/${key}`;
  }

  const baseUrl = safeBaseUrl(environmentConfig.MINIO_PUBLIC_BASE_URL);
  if (baseUrl) {
    return `${baseUrl}/${key}`;
  }

  return `${environmentConfig.MINIO_ENDPOINT}/${environmentConfig.MINIO_BUCKET}/${key}`;
}

function normalizeFilename(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function inferExtension(contentType: string | undefined, fileName: string): string {
  const fromName = fileName.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "avif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }

  if (contentType === "image/png") {
    return "png";
  }

  if (contentType === "image/webp") {
    return "webp";
  }

  if (contentType === "image/avif") {
    return "avif";
  }

  return "jpg";
}

function buildObjectKey(fileName: string, contentType?: string) {
  const slug = normalizeFilename(fileName) || "gallery-image";
  const extension = inferExtension(contentType, fileName);
  const stamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);

  return `gallery/${new Date().toISOString().slice(0, 10)}/${slug}-${stamp}-${random}.${extension}`;
}

async function uploadToR2(key: string, contentType: string | undefined, body: Buffer): Promise<UploadResult> {
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: environmentConfig.CF_R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType ?? "application/octet-stream"
    })
  );

  return {
    provider: "cloudflare-r2",
    key,
    url: resolvePublicUrl("cloudflare-r2", key)
  };
}

async function uploadToMinio(key: string, contentType: string | undefined, body: Buffer): Promise<UploadResult> {
  const client = getMinioClient();

  await client.send(
    new PutObjectCommand({
      Bucket: environmentConfig.MINIO_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType ?? "application/octet-stream"
    })
  );

  return {
    provider: "minio",
    key,
    url: resolvePublicUrl("minio", key)
  };
}

export async function uploadGalleryImage(fileName: string, contentType: string | undefined, body: Buffer): Promise<UploadResult> {
  if (!hasR2Config() && !hasMinioConfig()) {
    throw new Error("GALLERY_STORAGE_NOT_CONFIGURED");
  }

  const key = buildObjectKey(fileName, contentType);

  if (hasR2Config()) {
    try {
      return await uploadToR2(key, contentType, body);
    } catch {
      if (!hasMinioConfig()) {
        throw new Error("R2_UPLOAD_FAILED");
      }
    }
  }

  if (!hasMinioConfig()) {
    throw new Error("MINIO_STORAGE_NOT_CONFIGURED");
  }

  return uploadToMinio(key, contentType, body);
}

export function getGalleryUploadLimits() {
  const maxFiles = Number(environmentConfig.GALLERY_UPLOAD_MAX_FILES ?? "20");
  const maxFileSizeMb = Number(environmentConfig.GALLERY_UPLOAD_MAX_FILE_SIZE_MB ?? "10");

  return {
    maxFiles: Number.isFinite(maxFiles) ? Math.max(1, Math.min(100, maxFiles)) : 20,
    maxFileSizeBytes: Number.isFinite(maxFileSizeMb)
      ? Math.max(1, Math.min(50, maxFileSizeMb)) * 1024 * 1024
      : 10 * 1024 * 1024
  };
}
