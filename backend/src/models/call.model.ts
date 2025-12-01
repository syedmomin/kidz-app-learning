export type CallStatus = "ongoing" | "completed" | "failed";

export interface TranscriptItem {
  speaker: "user" | "ai";
  text: string;
  timestamp: string; // ISO
}

export interface CallRecord {
  callId: string;
  name: string;
  phone: string;
  script: string;
  voice: string;
  status: CallStatus;
  startedAt: number;
  endedAt?: number;
  duration?: number; // seconds
  transcript: TranscriptItem[];
  meta?: Record<string, unknown>;
}
