import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbmCalculationService } from '../../services/cbm-calculation.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Summary
      </h2>
      
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div class="summary-item">
          <span class="summary-label">Total rows:</span>
          <span class="summary-value">{{ calcService.shipmentItems().length }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Total volume:</span>
          <span class="summary-value">{{ calcService.totalVolumeM3() | number:'1.3-3' }} m³</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Converted volume:</span>
          <span class="summary-value">{{ calcService.totalVolumeFt3() | number:'1.3-3' }} ft³</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Total weight:</span>
          <span class="summary-value">{{ calcService.totalWeightKg() | number:'1.1-1' }} kg</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Converted weight:</span>
          <span class="summary-value">{{ calcService.totalWeightLb() | number:'1.1-1' }} lb</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Freight Class:</span>
          <span class="summary-value" style="color: #ef4444;">Class {{ calcService.freightClass() }} ({{ calcService.densityLbFt3() | number:'1.1-1' }} lb/ft³)</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Containers needed:</span>
          <span class="summary-value">{{ calcService.containersNeeded() }}</span>
        </div>
      </div>

      <div class="info-box">
        <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.25rem;">
          🚚 Freight Class Info:
        </h4>
        <p style="font-size: 0.75rem; color: var(--text-muted);">
          Class 50-500 (NMFC). Lower number = lower shipping cost. Based on density calculation.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #f8fafc;
    }
    .summary-label { color: var(--text-muted); font-size: 0.9rem; }
    .summary-value { font-weight: 700; color: var(--text-main); font-size: 0.9rem; }
    .info-box {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #f8fafc;
      border-top: 4px solid var(--primary);
      border-radius: 4px;
    }
  `]
})
export class SummaryComponent {
  calcService = inject(CbmCalculationService);
}
