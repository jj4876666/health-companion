/**
 * Medical Update Events - Real-time synchronization for demo accounts
 * 
 * This module provides event-based communication between Health Officer Dashboard
 * and Patient Records for demo accounts using localStorage.
 */

export interface MedicalUpdateData {
  [key: string]: string | number | boolean;
}

export interface MedicalUpdate {
  id: string;
  update_type: string;
  title: string;
  data: MedicalUpdateData;
  officer_name: string | null;
  facility_name: string | null;
  created_at: string;
}

export type MedicalUpdateEvent = {
  patientId: string;
  update: MedicalUpdate;
  timestamp: string;
};

class MedicalUpdateEmitter {
  private listeners: Map<string, Set<(event: MedicalUpdateEvent) => void>> = new Map();

  /**
   * Subscribe to medical updates for a specific patient
   */
  subscribe(patientId: string, callback: (event: MedicalUpdateEvent) => void) {
    if (!this.listeners.has(patientId)) {
      this.listeners.set(patientId, new Set());
    }
    this.listeners.get(patientId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(patientId);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(patientId);
        }
      }
    };
  }

  /**
   * Emit a medical update event
   */
  emit(patientId: string, update: MedicalUpdate) {
    const event: MedicalUpdateEvent = {
      patientId,
      update,
      timestamp: new Date().toISOString(),
    };

    // Notify all subscribers for this patient
    const callbacks = this.listeners.get(patientId);
    if (callbacks) {
      callbacks.forEach(callback => callback(event));
    }

    // Also emit a global event for any component listening
    window.dispatchEvent(new CustomEvent('medical-update', { detail: event }));

    console.log('[MEDICAL UPDATE] Emitted update for patient:', patientId, update.title);
  }

  /**
   * Subscribe to all medical updates (global listener)
   */
  subscribeAll(callback: (event: MedicalUpdateEvent) => void) {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<MedicalUpdateEvent>;
      callback(customEvent.detail);
    };

    window.addEventListener('medical-update', handler);

    // Return unsubscribe function
    return () => {
      window.removeEventListener('medical-update', handler);
    };
  }
}

// Singleton instance
export const medicalUpdateEmitter = new MedicalUpdateEmitter();
