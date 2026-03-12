/**
 * Health Officer Audit Log System
 * 
 * Tracks all actions performed by health officers on patient records.
 * Provides immutable audit trail for compliance and accountability.
 */

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officerId: string;
  officerName: string;
  facilityName: string;
  action: 'ADD_VITALS' | 'ADD_MEDICATION' | 'ADD_LAB_RESULT' | 'ADD_CLINICAL_NOTE' | 
          'ADD_ALLERGY' | 'ADD_CONDITION' | 'ADD_IMMUNIZATION' | 'ADD_BLOOD_SUGAR' | 
          'VIEW_PATIENT' | 'SEARCH_PATIENT';
  patientId: string;
  patientName: string;
  updateType: string;
  updateTitle: string;
  updateData: Record<string, string | number | boolean>;
  ipAddress?: string;
  deviceInfo?: string;
}

class HealthOfficerAuditLogger {
  private storageKey = 'emec_health_officer_audit_log';

  /**
   * Log a health officer action
   */
  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const fullEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    // Get existing logs
    const logs = this.getAllLogs();
    
    // Add new entry at the beginning (most recent first)
    logs.unshift(fullEntry);
    
    // Keep only last 1000 entries to prevent storage overflow
    const trimmedLogs = logs.slice(0, 1000);
    
    // Save to localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(trimmedLogs));
    
    console.log('[AUDIT LOG] Logged action:', fullEntry.action, 'for patient:', fullEntry.patientName);
    
    return fullEntry;
  }

  /**
   * Get all audit logs
   */
  getAllLogs(): AuditLogEntry[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('[AUDIT LOG] Error reading logs:', error);
      return [];
    }
  }

  /**
   * Get logs for a specific patient
   */
  getLogsForPatient(patientId: string): AuditLogEntry[] {
    return this.getAllLogs().filter(log => log.patientId === patientId);
  }

  /**
   * Get logs for a specific officer
   */
  getLogsForOfficer(officerId: string): AuditLogEntry[] {
    return this.getAllLogs().filter(log => log.officerId === officerId);
  }

  /**
   * Get logs for a specific facility
   */
  getLogsForFacility(facilityName: string): AuditLogEntry[] {
    return this.getAllLogs().filter(log => log.facilityName === facilityName);
  }

  /**
   * Get logs within a date range
   */
  getLogsByDateRange(startDate: Date, endDate: Date): AuditLogEntry[] {
    return this.getAllLogs().filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  /**
   * Get logs by action type
   */
  getLogsByAction(action: AuditLogEntry['action']): AuditLogEntry[] {
    return this.getAllLogs().filter(log => log.action === action);
  }

  /**
   * Export logs as CSV
   */
  exportAsCSV(): string {
    const logs = this.getAllLogs();
    const headers = ['Timestamp', 'Officer', 'Facility', 'Action', 'Patient', 'Update Type', 'Title'];
    const rows = logs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.officerName,
      log.facilityName,
      log.action,
      log.patientName,
      log.updateType,
      log.updateTitle,
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Clear all logs (admin only - use with caution)
   */
  clearAllLogs(): void {
    localStorage.removeItem(this.storageKey);
    console.log('[AUDIT LOG] All logs cleared');
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const logs = this.getAllLogs();
    const actionCounts: Record<string, number> = {};
    const officerCounts: Record<string, number> = {};
    const patientCounts: Record<string, number> = {};

    logs.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      officerCounts[log.officerName] = (officerCounts[log.officerName] || 0) + 1;
      patientCounts[log.patientName] = (patientCounts[log.patientName] || 0) + 1;
    });

    return {
      totalLogs: logs.length,
      actionCounts,
      officerCounts,
      patientCounts,
      oldestLog: logs[logs.length - 1]?.timestamp,
      newestLog: logs[0]?.timestamp,
    };
  }
}

// Singleton instance
export const auditLogger = new HealthOfficerAuditLogger();

// Helper function to map update type to action
export function getActionFromUpdateType(updateType: string): AuditLogEntry['action'] {
  const mapping: Record<string, AuditLogEntry['action']> = {
    'vitals': 'ADD_VITALS',
    'blood_sugar': 'ADD_BLOOD_SUGAR',
    'medication': 'ADD_MEDICATION',
    'lab_result': 'ADD_LAB_RESULT',
    'clinical_note': 'ADD_CLINICAL_NOTE',
    'allergy': 'ADD_ALLERGY',
    'condition': 'ADD_CONDITION',
    'immunization': 'ADD_IMMUNIZATION',
  };
  
  return mapping[updateType] || 'ADD_CLINICAL_NOTE';
}
