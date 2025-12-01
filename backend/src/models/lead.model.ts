export type LeadStatus = 'idle' | 'scheduled' | 'ongoing' | 'completed' | 'failed';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  script: string;
  createdAt: number;
  status?: LeadStatus;
  scheduledAt?: string | null;
  lastUpdatedAt?: number;
}
