import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

const API_BASE = (window as any).__env?.API_BASE || "http://localhost:4000/api";

export interface CallResponse {
  success: boolean;
  callId?: string;
  message?: string;
  status?: "ongoing" | "completed" | "failed";
  duration?: number;
  transcript?: { speaker: "user" | "ai"; text: string; timestamp: string }[];
}

export interface LeadResponse {
  success: boolean;
  lead?: any;
  leads?: any[];
  message?: string;
}

@Injectable({ providedIn: "root" })
export class ApiService {
  callBase = `${API_BASE}/call`;
  leadBase = `${API_BASE}/lead`;

  constructor(private http: HttpClient) {}

  // ===== CALL ENDPOINTS =====

  /** Start a new AI call with lead details */
  startCall(data: { name: string; phone: string; script: string; voice: string }): Observable<CallResponse> {
    return this.http.post<CallResponse>(`${this.callBase}/start`, data);
  }

  /** Get live call status and transcript */
  getCallStatus(callId: string): Observable<CallResponse> {
    return this.http.get<CallResponse>(`${this.callBase}/status/${callId}`);
  }

  /** Stop an ongoing call */
  stopCall(callId: string): Observable<CallResponse> {
    return this.http.post<CallResponse>(`${this.callBase}/stop`, { callId });
  }

  /** Stream user audio chunk to backend. Accepts Uint8Array or ArrayBuffer. */
  streamUserAudio(callId: string, audioChunk: Uint8Array | ArrayBuffer): Observable<CallResponse> {
    const formData = new FormData();
    formData.append("callId", callId);

    // Convert to Uint8Array
    let audioData: any;
    if (audioChunk instanceof Uint8Array) {
      audioData = audioChunk;
    } else if (audioChunk instanceof ArrayBuffer) {
      audioData = new Uint8Array(audioChunk);
    } else {
      audioData = new Uint8Array(0);
    }

    // Cast to any to avoid Blob type issues
    formData.append("audio", new Blob([audioData as any], { type: "audio/wav" }));
    return this.http.post<CallResponse>(`${this.callBase}/stream-user`, formData);
  }

  // ===== LEAD ENDPOINTS =====

  /** Get all contacts/leads */
  getContacts(): Observable<LeadResponse> {
    return this.http.get<LeadResponse>(`${this.leadBase}/contacts`);
  }

  /** Add a new lead */
  addLead(data: { name: string; phone: string; script: string }): Observable<LeadResponse> {
    return this.http.post<LeadResponse>(`${this.leadBase}/add`, data);
  }

  /** Start a call for a lead (backend side) */
  startLeadCall(leadId: string): Observable<LeadResponse> {
    return this.http.post<LeadResponse>(`${this.leadBase}/start/${leadId}`, {});
  }

  /** Schedule a call for a lead */
  scheduleLeadCall(leadId: string, scheduledAt: string): Observable<LeadResponse> {
    return this.http.post<LeadResponse>(`${this.leadBase}/schedule/${leadId}`, { scheduledAt });
  }

  /** Delete a lead */
  deleteLead(leadId: string): Observable<LeadResponse> {
    return this.http.delete<LeadResponse>(`${this.leadBase}/${leadId}`);
  }
}
