import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { LeadContextService } from '../services/lead-context.service';
import { interval, Subscription } from 'rxjs';

interface TranscriptItem {
  speaker: 'user' | 'ai';
  text: string;
  timestamp: string;
}

@Component({
  selector: 'app-call-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div *ngIf="error" class="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <div *ngIf="!callStarted" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-4">Call Verification</h2>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <span class="font-medium">Name:</span>
            <span>{{ leadName }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-medium">Phone:</span>
            <span class="text-indigo-600 font-semibold">{{ leadPhone }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-medium">Script:</span>
            <span class="line-clamp-2">{{ leadScript }}</span>
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            (click)="startCall()"
            [disabled]="verifying"
            class="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:scale-105 transition disabled:opacity-60"
          >
            <span *ngIf="!verifying">✓ Start Call</span>
            <span *ngIf="verifying">Verifying...</span>
          </button>
          <button
            (click)="goBack()"
            class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:scale-105 transition"
          >
            Cancel
          </button>
        </div>
      </div>

      <div *ngIf="callStarted" class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">Live Call</h2>
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span class="font-semibold">{{ callDuration }}s</span>
          </div>
        </div>

        <div class="mb-6 p-4 bg-white rounded-lg border-l-4 border-indigo-500">
          <h3 class="font-semibold mb-3">Transcript</h3>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div
              *ngFor="let item of transcript"
              [ngClass]="item.speaker === 'ai' ? 'bg-indigo-50 border-l-4 border-indigo-400' : 'bg-green-50 border-l-4 border-green-400'"
              class="p-3 rounded"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold text-sm" [ngClass]="item.speaker === 'ai' ? 'text-indigo-700' : 'text-green-700'">
                  {{ (item.speaker | titlecase) }}
                </span>
                <span class="text-xs text-gray-500">{{ item.timestamp }}</span>
              </div>
              <div class="text-sm text-gray-800">{{ item.text }}</div>
            </div>
            <div *ngIf="transcript.length === 0" class="text-center text-gray-500 py-4">
              Waiting for AI response...
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            (click)="stopCall()"
            class="px-6 py-2 bg-red-500 text-white rounded-lg hover:scale-105 transition"
          >
            Stop Call
          </button>
        </div>
      </div>

      <div *ngIf="callCompleted" class="bg-white rounded-lg shadow p-6 mt-6">
        <h3 class="text-lg font-bold mb-4">Call Summary</h3>
        <div class="space-y-2 text-sm">
          <div><span class="font-medium">Duration:</span> {{ callDuration }}s</div>
          <div><span class="font-medium">Status:</span> {{ callStatus | titlecase }}</div>
          <div><span class="font-medium">Transcript Lines:</span> {{ transcript.length }}</div>
        </div>
        <button
          (click)="viewFullTranscript()"
          class="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:scale-105 transition"
        >
          View Full Transcript
        </button>
      </div>
    </div>
  `,
})
export class CallSectionComponent implements OnInit, OnDestroy {
  callId: string | null = null;
  leadName = '';
  leadPhone = '';
  leadScript = '';
  callStarted = false;
  callCompleted = false;
  callDuration = 0;
  callStatus: 'ongoing' | 'completed' | 'failed' = 'ongoing';
  verifying = false;
  error = '';
  transcript: TranscriptItem[] = [];
  pollingSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private leadContext: LeadContextService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get lead from service
    const lead = this.leadContext.getLead();
    if (lead) {
      this.leadName = lead.name;
      this.leadPhone = lead.phone;
      this.leadScript = lead.script;
    } else {
      this.error = 'Lead information not found. Please select a lead from contacts.';
    }
  }

  startCall() {
    if (!this.leadPhone) {
      this.error = 'Phone number is required';
      return;
    }

    this.verifying = true;
    this.error = '';

    this.api
      .startCall({
        name: this.leadName,
        phone: this.leadPhone,
        script: this.leadScript,
        voice: 'female_calm',
      })
      .subscribe({
        next: (res) => {
          this.verifying = false;
          if (res.success && res.callId) {
            this.callId = res.callId;
            this.callStarted = true;
            this.startPolling();
          } else {
            this.error = res.message || 'Failed to start call';
          }
        },
        error: (err) => {
          this.verifying = false;
          this.error = err?.error?.message || 'Phone verification failed or call could not be started';
          console.error(err);
        },
      });
  }

  startPolling() {
    if (!this.callId) return;
    this.pollingSubscription = interval(2000).subscribe(() => {
      this.api.getCallStatus(this.callId!).subscribe({
        next: (res) => {
          if (res.success) {
            this.callDuration = res.duration || 0;
            this.transcript = res.transcript || [];
            this.callStatus = res.status as any;
            if (res.status === 'completed' || res.status === 'failed') {
              this.callCompleted = true;
              this.callStarted = false;
              this.pollingSubscription?.unsubscribe();
            }
          }
        },
        error: (err) => console.error('Poll error:', err),
      });
    });
  }

  stopCall() {
    if (!this.callId) return;
    this.api.stopCall(this.callId).subscribe({
      next: (res) => {
        if (res.success) {
          this.callCompleted = true;
          this.callStarted = false;
          this.pollingSubscription?.unsubscribe();
        }
      },
      error: (err) => {
        this.error = 'Failed to stop call';
        console.error(err);
      },
    });
  }

  viewFullTranscript() {
    alert('Full transcript:\n' + this.transcript.map(t => `${t.speaker}: ${t.text}`).join('\n'));
  }

  goBack() {
    this.leadContext.clearLead();
    this.router.navigate(['/contacts']);
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }
}
