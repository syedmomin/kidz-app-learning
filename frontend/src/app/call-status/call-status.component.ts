import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../services/api.service";
import { interval, Subscription, switchMap, startWith, catchError, of } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-call-status",
  template: `
    <div *ngIf="loading">Loading call status...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
    <div *ngIf="status">
      <h2>Call {{ status?.status }}</h2>
      <p>Duration: {{ status?.duration }}s</p>
      <h3>Transcript</h3>
      <div class="transcript">
        <div *ngFor="let line of status?.transcript">{{ line }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .transcript {
        background: #f5f5f5;
        padding: 1rem;
        border-radius: 4px;
      }
      .error {
        color: #b00020;
      }
    `
  ],
  imports: [CommonModule]
})
export class CallStatusComponent implements OnInit, OnDestroy {
  callId = "";
  status: any = null;
  error = "";
  loading = true;
  sub?: Subscription;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.callId = this.route.snapshot.paramMap.get("callId") || "";
    if (!this.callId) {
      this.error = "Missing callId";
      this.loading = false;
      return;
    }

    this.sub = interval(4000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.api.getCallStatus(this.callId).pipe(
            catchError((err) => {
              this.error = err?.error?.message || "Failed to fetch status";
              return of(null);
            })
          )
        )
      )
      .subscribe((res) => {
        if (res) {
          this.status = res;
          this.error = "";
        }
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
