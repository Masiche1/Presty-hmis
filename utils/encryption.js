// utils/encryption.js
const crypto = require("crypto");
require("dotenv").config();

const algorithm = "aes-256-gcm";
const ivLength = 16;
const saltLength = 64;
const tagLength = 16;
const keyLength = 32;
const digestAlgorithm = "sha256";

class Encryptor {
  static async deriveKey(password, salt) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        100000,
        keyLength,
        digestAlgorithm,
        (err, key) => {
          if (err) reject(err);
          else resolve(key);
        },
      );
    });
  }

  static async encrypt(text, masterKey = process.env.ENCRYPTION_KEY) {
    const salt = crypto.randomBytes(saltLength);
    const iv = crypto.randomBytes(ivLength);
    const key = await this.deriveKey(masterKey, salt);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const encrypted = Buffer.concat([
      cipher.update(text, "utf8"),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, encrypted]).toString("base64");
  }

  static async decrypt(encryptedData, masterKey = process.env.ENCRYPTION_KEY) {
    const buffer = Buffer.from(encryptedData, "base64");

    const salt = buffer.slice(0, saltLength);
    const iv = buffer.slice(saltLength, saltLength + ivLength);
    const tag = buffer.slice(
      saltLength + ivLength,
      saltLength + ivLength + tagLength,
    );
    const encrypted = buffer.slice(saltLength + ivLength + tagLength);

    const key = await this.deriveKey(masterKey, salt);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(tag);

    return decipher.update(encrypted) + decipher.final("utf8");
  }
}

class Encryption {
  constructor(encryptionKey) {
    this.algorithm = "aes-256-gcm";
    this.key = crypto.scryptSync(encryptionKey, "salt", 32);
  }

  encrypt(text) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();
    return {
      iv: iv.toString("hex"),
      encrypted,
      authTag: authTag.toString("hex"),
    };
  }

  decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(encryptedData.iv, "hex"),
    );
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));
    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
module.exports = Encryptor;
