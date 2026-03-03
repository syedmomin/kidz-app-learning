import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbmCalculationService } from '../../services/cbm-calculation.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 1.5rem;">Shipment Summary</h2>
      
      <div class="summary-grid">
        <div class="summary-stat stat-blue">
          <p style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">Total CBM</p>
          <p style="font-size: 1.5rem; font-weight: 700;">{{ calcService.totalVolumeM3() | number:'1.2-2' }} m³</p>
          <p style="font-size: 0.875rem; opacity: 0.8;">{{ calcService.totalVolumeFt3() | number:'1.2-2' }} ft³</p>
        </div>
        <div class="summary-stat stat-emerald">
          <p style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">Total Weight</p>
          <p style="font-size: 1.5rem; font-weight: 700;">{{ calcService.totalWeightKg() | number:'1.2-2' }} kg</p>
          <p style="font-size: 0.875rem; opacity: 0.8;">{{ calcService.totalWeightLb() | number:'1.2-2' }} lb</p>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.5rem; border-bottom: 1px solid #f8fafc;">
          <span style="color: var(--text-muted);">Density</span>
          <span style="font-weight: 600; color: var(--text-main);">{{ calcService.density() | number:'1.2-2' }} lb/ft³</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.5rem; border-bottom: 1px solid #f8fafc;">
          <span style="color: var(--text-muted);">Freight Class</span>
          <span class="badge badge-amber">Class {{ calcService.freightClass() }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: var(--text-muted);">Utilization</span>
          <span style="font-weight: 600;" [style.color]="getUtilizationColor()">
            {{ getUtilization() | number:'1.1-1' }}%
          </span>
        </div>
      </div>

      @if (calcService.totalWeightKg() > calcService.selectedContainer().maxWeightKg) {
        <div class="alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="flex-shrink: 0;">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <span>Weight exceeds container capacity ({{ calcService.selectedContainer().maxWeightKg }} kg)</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class SummaryComponent {
  calcService = inject(CbmCalculationService);

  getUtilization() {
    const container = this.calcService.selectedContainer();
    const capacity = container.internalWidthM * container.internalHeightM * container.internalLengthM;
    return (this.calcService.totalVolumeM3() / capacity) * 100;
  }

  getUtilizationColor() {
    const u = this.getUtilization();
    if (u > 100) return '#ef4444';
    if (u > 90) return '#d97706';
    return '#10b981';
  }
}
