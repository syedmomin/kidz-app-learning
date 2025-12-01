import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div
      class="max-w-2xl mx-auto p-6"
      [class.opacity-100]="loaded"
      [class.opacity-0]="!loaded"
      [class.transition-opacity]="true"
      [class.duration-500]="true"
    >
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="space-y-6 bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg transform transition-all duration-300"
        aria-label="Add lead form"
      >
        <h2 class="text-2xl font-extrabold mb-1 text-gray-800">Add a Lead</h2>
        <p class="text-sm text-gray-500">
          Enter contact details and pitch — add to your contacts.
        </p>

        <label class="block">
          <span class="text-sm font-medium text-gray-700">Full name</span>
          <input
            formControlName="name"
            placeholder="Enter full name"
            class="mt-2 block w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-transform duration-150 hover:scale-[1.01]"
            [attr.aria-invalid]="form.controls['name'].invalid"
            aria-required="true"
          />
          <div
            class="text-sm text-red-600 mt-1"
            *ngIf="
              form.controls['name'].invalid && form.controls['name'].touched
            "
          >
            Name is required (min 3)
          </div>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-gray-700">Phone</span>
          <input
            formControlName="phone"
            placeholder="Enter phone number"
            class="mt-2 block w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-transform duration-150 hover:scale-[1.01]"
            [attr.aria-invalid]="form.controls['phone'].invalid"
          />
          <div
            class="text-sm text-red-600 mt-1"
            *ngIf="
              form.controls['phone'].invalid && form.controls['phone'].touched
            "
          >
            Phone invalid (10-15 digits, optional +)
          </div>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-gray-700">Script / Pitch</span>
          <textarea
            formControlName="script"
            rows="4"
            placeholder="Write your sales pitch here"
            class="mt-2 block w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-transform duration-150 hover:scale-[1.01]"
          ></textarea>
          <div
            class="text-sm text-red-600 mt-1"
            *ngIf="
              form.controls['script'].invalid && form.controls['script'].touched
            "
          >
            Script is required (min 10)
          </div>
        </label>

        <div class="flex items-center justify-between gap-4">
          <button
            type="submit"
            [disabled]="form.invalid || saving"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold px-5 py-2 rounded-lg shadow hover:scale-105 active:scale-95 transition-transform duration-150 disabled:opacity-60"
            [attr.aria-disabled]="form.invalid || saving"
          >
            <svg
              *ngIf="saving"
              class="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke-width="4"
                stroke-opacity="0.25"
              />
              <path
                d="M22 12a10 10 0 00-10-10"
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
            <span *ngIf="!saving">Add to Contacts</span>
            <span *ngIf="saving">Adding...</span>
          </button>

          <div class="flex items-center space-x-3">
            <div
              *ngIf="successPulse"
              class="px-3 py-2 rounded-lg bg-green-50 text-green-700 font-medium animate-pulse"
            >
              Added
            </div>
            <button
              type="button"
              (click)="resetForm()"
              class="text-sm text-gray-600 hover:underline"
            >
              Reset
            </button>
          </div>
        </div>

        <div *ngIf="errorMsg" class="text-sm text-red-600 mt-1">
          {{ errorMsg }}
        </div>
      </form>
    </div>
  `,
})
export class LeadFormComponent implements OnInit {
  loading = false;
  saving = false;
  successPulse = false;
  errorMsg = '';
  loaded = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+]{10,15}$/)]],
      script: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    // fade-in on load
    setTimeout(() => (this.loaded = true), 10);
  }

  resetForm() {
    this.form.reset();
    this.errorMsg = '';
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.errorMsg = '';

    // Call backend API to add lead
    this.api.addLead(this.form.value).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.successPulse = true;
          setTimeout(() => (this.successPulse = false), 1200);
          this.form.reset();
        } else {
          this.errorMsg = res.message || 'Failed to add lead';
        }
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message || 'Failed to add lead';
        console.error(err);
      },
    });
  }
}
