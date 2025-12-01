export type Lead = {
  id: string;
  name: string;
  phone: string;
  script: string;
  createdAt: number;
  status?: 'idle' | 'scheduled' | 'ongoing' | 'completed' | 'failed';
  scheduledAt?: string | null;
  lastUpdatedAt?: number;
};

const STORAGE_KEY = 'leads';

export class LeadService {
  static getLeads(): Lead[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Lead[]) : [];
    } catch {
      return [];
    }
  }

  static saveLeads(leads: Lead[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }

  static deleteLead(id: string) {
    const leads = this.getLeads().filter(l => l.id !== id);
    this.saveLeads(leads);
  }

  static updateLead(id: string, patch: Partial<Lead>) {
    const leads = this.getLeads();
    const idx = leads.findIndex(l => l.id === id);
    if (idx === -1) return null;
    leads[idx] = { ...leads[idx], ...patch, lastUpdatedAt: Date.now() };
    this.saveLeads(leads);
    return leads[idx];
  }

  static scheduleCall(id: string, at: string) {
    return this.updateLead(id, { status: 'scheduled', scheduledAt: at });
  }

  static startCall(id: string) {
    return this.updateLead(id, { status: 'ongoing', scheduledAt: null });
  }

  static markCompleted(id: string) {
    return this.updateLead(id, { status: 'completed' });
  }
}
