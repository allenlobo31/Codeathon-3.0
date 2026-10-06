const MAGIC = new TextEncoder().encode('VX1');
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const PBKDF2_ROUNDS = 120000;

function getCrypto() {
  if (!globalThis.crypto?.subtle) throw new Error('Browser encryption is not available');
  return globalThis.crypto;
}

async function deriveKey(code, salt) {
  const cryptoApi = getCrypto();
  const material = await cryptoApi.subtle.importKey(
    'raw',
    new TextEncoder().encode(code),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return cryptoApi.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ROUNDS, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export function generateShareCode() {
  const values = new Uint32Array(1);
  getCrypto().getRandomValues(values);
  return String(100000 + (values[0] % 900000));
}

export async function encryptFile(file, code) {
  const cryptoApi = getCrypto();
  const salt = cryptoApi.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = cryptoApi.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(code, salt);
  const encrypted = new Uint8Array(await cryptoApi.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    await file.arrayBuffer(),
  ));
  const payload = new Uint8Array(MAGIC.length + salt.length + iv.length + encrypted.length);
  payload.set(MAGIC, 0);
  payload.set(salt, MAGIC.length);
  payload.set(iv, MAGIC.length + salt.length);
  payload.set(encrypted, MAGIC.length + salt.length + iv.length);
  return new File([payload], file.name, { type: file.type || 'application/octet-stream' });
}

export async function decryptBlob(blob, code, mimeType) {
  const cryptoApi = getCrypto();
  const payload = new Uint8Array(await blob.arrayBuffer());
  const headerLength = MAGIC.length + SALT_LENGTH + IV_LENGTH;
  if (payload.length <= headerLength || !MAGIC.every((value, index) => payload[index] === value)) {
    throw new Error('This file is not a valid VaultX encrypted file');
  }
  const saltStart = MAGIC.length;
  const ivStart = saltStart + SALT_LENGTH;
  const salt = payload.slice(saltStart, ivStart);
  const iv = payload.slice(ivStart, headerLength);
  const ciphertext = payload.slice(headerLength);
  const key = await deriveKey(code, salt);
  const decrypted = await cryptoApi.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new Blob([decrypted], { type: mimeType || 'application/octet-stream' });
}
