// db/compressionManager.js
const zlib = require("zlib");
const { promisify } = require("util");

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

class CompressionManager {
  static async compress(data) {
    const jsonString = JSON.stringify(data);
    const compressed = await gzip(jsonString);
    return compressed.toString("base64");
  }

  static async decompress(compressedData) {
    const buffer = Buffer.from(compressedData, "base64");
    const decompressed = await gunzip(buffer);
    return JSON.parse(decompressed.toString());
  }
}
