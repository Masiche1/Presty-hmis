// db/batchProcessor.js
class BatchProcessor {
  constructor(batchSize = 100) {
    this.batchSize = batchSize;
    this.batches = new Map();
    this.processing = false;
  }

  addToBatch(table, operation, data) {
    const batchKey = `${table}-${operation}`;
    if (!this.batches.has(batchKey)) {
      this.batches.set(batchKey, []);
    }
    this.batches.get(batchKey).push(data);

    if (this.batches.get(batchKey).length >= this.batchSize) {
      this.processBatch(batchKey);
    }
  }

  async processBatch(batchKey) {
    if (this.processing) return;
    this.processing = true;

    try {
      const [table, operation] = batchKey.split("-");
      const batch = this.batches.get(batchKey);
      if (!batch || batch.length === 0) return;

      const batchData = batch.splice(0, this.batchSize);

      switch (operation) {
        case "INSERT":
          await this.batchInsert(table, batchData);
          break;
        case "UPDATE":
          await this.batchUpdate(table, batchData);
          break;
        case "DELETE":
          await this.batchDelete(table, batchData);
          break;
      }
    } finally {
      this.processing = false;
    }
  }

  async batchInsert(table, records) {
    const columns = Object.keys(records[0]);
    const values = records.map((record) => columns.map((col) => record[col]));

    const placeholders = values
      .map(() => `(${columns.map(() => "?").join(",")})`)
      .join(",");

    const sql = `
      INSERT INTO ${table} (${columns.join(",")})
      VALUES ${placeholders}
      ON CONFLICT (id) DO UPDATE SET
      ${columns.map((col) => `${col} = EXCLUDED.${col}`).join(",")};
    `;

    await global.syncManager.activeDb.query(sql, values.flat());
  }

  // ... similar implementations for batchUpdate and batchDelete
}
