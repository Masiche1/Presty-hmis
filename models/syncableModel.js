// models/syncableModel.js
class SyncableModel {
  static async createWithSync(data) {
    const encrypted = global.encryption.encrypt(JSON.stringify(data));
    const compressedData = await CompressionManager.compress(encrypted);

    const record = await this.create({
      ...data,
      sync_data: compressedData,
      sync_status: global.syncManager.isOnline ? "synced" : "pending",
    });

    global.batchProcessor.addToBatch(this.tableName, "INSERT", record);

    return record;
  }

  static async updateWithSync(id, data) {
    const existing = await this.findById(id);
    const resolved = await ConflictResolver.resolveConflict(
      this.tableName,
      existing,
      data,
    );

    const encrypted = global.encryption.encrypt(JSON.stringify(resolved));
    const compressedData = await CompressionManager.compress(encrypted);

    const record = await this.update(id, {
      ...resolved,
      sync_data: compressedData,
      sync_status: global.syncManager.isOnline ? "synced" : "pending",
    });

    global.batchProcessor.addToBatch(this.tableName, "UPDATE", record);

    return record;
  }
}
