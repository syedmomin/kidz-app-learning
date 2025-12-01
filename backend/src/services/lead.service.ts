import path from 'path';
import fs from 'fs/promises';

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

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'leads.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf-8');
  }
}

async function readAll(): Promise<Lead[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}

async function writeAll(leads: Lead[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

export async function getLeads(): Promise<Lead[]> {
  return readAll();
}

export async function addLead(payload: { name: string; phone: string; script: string }): Promise<Lead> {
  const leads = await readAll();
  const newLead: Lead = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    script: payload.script.trim(),
    createdAt: Date.now(),
    status: 'idle',
    scheduledAt: null,
    lastUpdatedAt: Date.now(),
  };
  leads.unshift(newLead);
  await writeAll(leads);
  return newLead;
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  const leads = await readAll();
  const idx = leads.findIndex(l => l.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], ...patch, lastUpdatedAt: Date.now() };
  await writeAll(leads);
  return leads[idx];
}

export async function deleteLead(id: string): Promise<boolean> {
  const leads = await readAll();
  const filtered = leads.filter(l => l.id !== id);
  if (filtered.length === leads.length) return false;
  await writeAll(filtered);
  return true;
}
