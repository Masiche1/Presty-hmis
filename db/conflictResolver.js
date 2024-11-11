// db/conflictResolver.js
class ConflictResolver {
  static async resolveConflict(table, localRecord, serverRecord) {
    const strategy = this.getStrategy(table);
    return strategy(localRecord, serverRecord);
  }

  static getStrategy(table) {
    const strategies = {
      consultations: this.resolveConsultationConflict,
      consultation_medications: this.resolveMedicationConflict,
      consultation_diagnoses: this.resolveDiagnosisConflict,
    };
    return strategies[table] || this.defaultStrategy;
  }

  static async resolveConsultationConflict(local, server) {
    // If server record is newer and consultation is completed, use server version
    if (
      server.status === "completed" &&
      new Date(server.updated_at) > new Date(local.updated_at)
    ) {
      return server;
    }

    // Merge SOAP notes if both versions have updates
    if (local.updated_at !== server.updated_at) {
      return {
        ...local,
        subjective_notes: this.mergeNotes(
          local.subjective_notes,
          server.subjective_notes,
        ),
        objective_notes: this.mergeNotes(
          local.objective_notes,
          server.objective_notes,
        ),
        assessment_notes: this.mergeNotes(
          local.assessment_notes,
          server.assessment_notes,
        ),
        plan_notes: this.mergeNotes(local.plan_notes, server.plan_notes),
      };
    }

    return local;
  }

  static mergeNotes(localNotes, serverNotes) {
    if (!localNotes) return serverNotes;
    if (!serverNotes) return localNotes;
    if (localNotes === serverNotes) return localNotes;

    return `${serverNotes}\n\nLocal Updates:\n${localNotes}`;
  }
}
