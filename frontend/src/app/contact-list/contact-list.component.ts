import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { LeadContextService } from '../services/lead-context.service';
import { RouterModule, Router } from '@angular/router';

interface Lead {
  id: string;
  name: string;
  phone: string;
  script: string;
  createdAt: number;
  status?: 'idle' | 'scheduled' | 'ongoing' | 'completed' | 'failed';
  scheduledAt?: string | null;
}

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-5xl mx-auto p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Contacts</h2>
        <button
          (click)="loadContacts()"
          class="text-sm px-3 py-1 bg-indigo-500 text-white rounded hover:scale-105 transition"
        >
          Refresh
        </button>
      </div>

      <div *ngIf="loading" class="p-6 bg-white rounded-lg shadow text-center text-gray-600">
        Loading contacts...
      </div>

      <div *ngIf="error" class="p-6 bg-red-50 rounded-lg shadow text-red-700">
        {{ error }}
      </div>

      <div *ngIf="leads.length === 0 && !loading && !error" class="p-6 bg-white rounded-lg shadow text-center text-gray-600">
        No leads yet — add one using the form.
      </div>

      <div *ngIf="leads.length > 0" class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Script</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let lead of leads" class="hover:bg-gray-50 transition">
              <td class="px-4 py-3 align-top">
                <div class="font-semibold">{{ lead.name }}</div>
                <div class="text-xs text-gray-500">Added: {{ timeAgo(lead.createdAt) }}</div>
              </td>
              <td class="px-4 py-3 align-top">
                <div class="text-sm">{{ lead.phone }}</div>
              </td>
              <td class="px-4 py-3 align-top">
                <div class="text-sm line-clamp-2 max-w-xl">{{ lead.script }}</div>
              </td>
              <td class="px-4 py-3 align-top">
                <span
                  [ngClass]="statusBadgeClass(lead.status || 'idle')"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold"
                >
                  {{ (lead.status || 'idle') | titlecase }}
                </span>
                <div *ngIf="lead.scheduledAt" class="text-xs text-gray-500 mt-1">
                  At: {{ lead.scheduledAt }}
                </div>
              </td>
              <td class="px-4 py-3 align-top text-right space-x-2">
                <button
                  class="text-xs px-3 py-1 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded hover:scale-105 transition"
                  (click)="onStart(lead)"
                >
                  Start Call
                </button>

                <button
                  class="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:scale-105 transition"
                  (click)="onSchedule(lead.id)"
                >
                  Schedule
                </button>

                <button
                  class="text-xs px-3 py-1 bg-red-50 text-red-700 rounded hover:scale-105 transition"
                  (click)="onDelete(lead.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ContactListComponent implements OnInit {
  leads: Lead[] = [];
  loading = false;
  error = '';

  constructor(
    private api: ApiService,
    private leadContext: LeadContextService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    this.loading = true;
    this.error = '';
    this.api.getContacts().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.leads) {
          this.leads = res.leads as Lead[];
        } else {
          this.error = res.message || 'Failed to load contacts';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to load contacts';
        console.error(err);
      },
    });
  }

  onDelete(id: string) {
    if (!confirm('Delete this lead?')) return;
    this.api.deleteLead(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadContacts();
        } else {
          this.error = res.message || 'Failed to delete lead';
        }
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete lead';
        console.error(err);
      },
    });
  }

  onSchedule(id: string) {
    const at = prompt('Enter schedule time (e.g. 2025-12-31 15:30):');
    if (!at) return;
    this.api.scheduleLeadCall(id, at).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadContacts();
        } else {
          this.error = res.message || 'Failed to schedule call';
        }
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to schedule call';
        console.error(err);
      },
    });
  }

  onStart(lead: Lead) {
    // Store lead in service, then navigate
    this.leadContext.setLead({
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      script: lead.script,
    });
    this.router.navigate(['/call-section']);
  }

  timeAgo(ts: number) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  statusBadgeClass(status: string) {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'ongoing':
        return 'bg-indigo-100 text-indigo-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}
