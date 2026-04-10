import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(1).optional(),
  ADMIN_ROLE: z.string().optional(),
  ADMIN_SESSION_SECRET: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  ALLOW_FILE_LEAD_STORAGE_FALLBACK: z.enum(["true", "false"]).optional(),
  CF_R2_ENDPOINT: z.string().url().optional(),
  CF_R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  CF_R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  CF_R2_BUCKET: z.string().min(1).optional(),
  CF_R2_PUBLIC_BASE_URL: z.string().url().optional(),
  MINIO_ENDPOINT: z.string().url().optional(),
  MINIO_ACCESS_KEY: z.string().min(1).optional(),
  MINIO_SECRET_KEY: z.string().min(1).optional(),
  MINIO_BUCKET: z.string().min(1).optional(),
  MINIO_PUBLIC_BASE_URL: z.string().url().optional(),
  GALLERY_UPLOAD_MAX_FILES: z.string().regex(/^\d+$/).optional(),
  GALLERY_UPLOAD_MAX_FILE_SIZE_MB: z.string().regex(/^\d+$/).optional()
});

/** Docker Compose often sets `${VAR}` to an empty string when unset; treat as missing. */
function omitEmptyStringEnv(source: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const next: NodeJS.ProcessEnv = { ...source };
  for (const key of Object.keys(next)) {
    if (next[key] === "") {
      delete next[key];
    }
  }
  return next;
}

const parsed = envSchema.safeParse(omitEmptyStringEnv(process.env));

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const env = parsed.data;

export function isProductionEnvironment(): boolean {
  return env.NODE_ENV === "production";
}

export function hasDatabaseUrl(): boolean {
  return Boolean(env.DATABASE_URL);
}

export function allowFileLeadStorageFallback(): boolean {
  if (env.ALLOW_FILE_LEAD_STORAGE_FALLBACK) {
    return env.ALLOW_FILE_LEAD_STORAGE_FALLBACK === "true";
  }

  return !isProductionEnvironment();
}

export const environmentConfig = env;
