import { createHmac, timingSafeEqual } from "node:crypto";
import {
  ADMIN_SESSION_TTL_SECONDS,
  parseAdminRole,
  type AdminRole,
} from "./auth.constants";
import { environmentConfig, isProductionEnvironment } from "@/lib/env";

type AdminCredentials = {
  email: string;
  password: string;
  role: AdminRole;
};

const DEFAULT_ADMIN_EMAIL = "admin@vinipainting.com";
const DEFAULT_ADMIN_PASSWORD = "Admin123!";
const DEFAULT_ADMIN_SESSION_SECRET = "change-this-secret-in-production";

function ensureSecureProductionCredential(
  value: string,
  defaultValue: string,
  variableName: string,
): void {
  if (isProductionEnvironment() && value === defaultValue) {
    throw new Error(`${variableName} must be overridden in production`);
  }
}

function getSessionSecret(): string {
  const secret =
    environmentConfig.ADMIN_SESSION_SECRET ?? DEFAULT_ADMIN_SESSION_SECRET;
  ensureSecureProductionCredential(
    secret,
    DEFAULT_ADMIN_SESSION_SECRET,
    "ADMIN_SESSION_SECRET",
  );
  return secret;
}

export function getAdminCredentials(): AdminCredentials {
  const email = environmentConfig.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;
  const password = environmentConfig.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
  ensureSecureProductionCredential(
    password,
    DEFAULT_ADMIN_PASSWORD,
    "ADMIN_PASSWORD",
  );

  return {
    email,
    password,
    role: parseAdminRole(environmentConfig.ADMIN_ROLE),
  };
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

function encodeEmail(email: string): string {
  return Buffer.from(email, "utf8").toString("base64url");
}

function decodeEmail(emailEncoded: string): string {
  return Buffer.from(emailEncoded, "base64url").toString("utf8");
}

export function createAdminSessionToken(
  email: string,
  role: AdminRole,
  ttlSeconds = ADMIN_SESSION_TTL_SECONDS,
): string {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const emailEncoded = encodeEmail(email);
  const payload = `${emailEncoded}|${role}|${expiresAt}`;
  const signature = sign(payload);

  return `${payload}|${signature}`;
}

export function verifyAdminSessionToken(token: string): {
  valid: boolean;
  email?: string;
  role?: AdminRole;
} {
  const parts = token.split("|");

  if (parts.length !== 4) {
    return { valid: false };
  }

  const [emailEncoded, roleRaw, expiresAtRaw, incomingSignature] = parts;
  const role = parseAdminRole(roleRaw);
  const payload = `${emailEncoded}|${role}|${expiresAtRaw}`;
  const expectedSignature = sign(payload);

  const incoming = Buffer.from(incomingSignature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");

  if (
    incoming.length !== expected.length ||
    !timingSafeEqual(incoming, expected)
  ) {
    return { valid: false };
  }

  const expiresAt = Number(expiresAtRaw);

  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
    return { valid: false };
  }

  return { valid: true, email: decodeEmail(emailEncoded), role };
}
