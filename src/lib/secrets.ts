import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

/**
 * Application-level encryption for sensitive field values (secret, code).
 *
 * AES-256-GCM via the Node.js crypto module — an established primitive, not
 * invented crypto. The key is derived from `KEEVO_ENCRYPTION_KEY`.
 *
 * The long-term architecture should move encryption client-side
 * (zero-knowledge vault). Keeping encryption on a clear server boundary
 * (this file) means that transition does not require rewriting storage.
 */

const VERSION = "kv1";

function getKey(): Buffer {
  const raw = process.env.KEEVO_ENCRYPTION_KEY ?? "";
  if (!raw) {
    throw new Error("KEEVO_ENCRYPTION_KEY is not configured.");
  }
  try {
    const decoded = Buffer.from(raw, "base64");
    if (decoded.length === 32) return decoded;
  } catch {
    // fall through to hash derivation
  }
  return createHash("sha256").update(raw).digest();
}

export function isEncrypted(value: string): boolean {
  return value.startsWith(`${VERSION}:`);
}

export function encryptSecret(plain: string): string {
  if (!plain) return "";
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    VERSION,
    iv.toString("hex"),
    tag.toString("hex"),
    ciphertext.toString("hex"),
  ].join(":");
}

export function decryptSecret(stored: string): string {
  if (!stored || !isEncrypted(stored)) return stored;
  const [, ivHex, tagHex, ciphertextHex] = stored.split(":");
  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      getKey(),
      Buffer.from(ivHex, "hex"),
    );
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    return Buffer.concat([
      decipher.update(Buffer.from(ciphertextHex, "hex")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return stored;
  }
}