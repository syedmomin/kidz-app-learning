import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LeadData {
  id: string;
  name: string;
  phone: string;
  script: string;
}

@Injectable({ providedIn: 'root' })
export class LeadContextService {
  private leadSubject = new BehaviorSubject<LeadData | null>(null);
  public lead$ = this.leadSubject.asObservable();

  setLead(lead: LeadData) {
    this.leadSubject.next(lead);
  }

  getLead(): LeadData | null {
    return this.leadSubject.value;
  }

  clearLead() {
    this.leadSubject.next(null);
  }
}
