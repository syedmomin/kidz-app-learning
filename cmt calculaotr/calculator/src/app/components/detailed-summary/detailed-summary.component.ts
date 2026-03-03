import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbmCalculationService } from '../../services/cbm-calculation.service';

@Component({
    selector: 'app-detailed-summary',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div style="margin-top: 2rem; display: flex; flex-direction: column; gap: 2rem;">
      <!-- Itemized Result Table -->
      <div class="card overflow-x-auto">
        <table class="detail-table">
          <thead>
            <tr>
              <th>Row</th>
              <th>Color</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Placed</th>
              <th>Volume (m³)</th>
              <th>Density (lb/ft³)</th>
              <th>Freight Class</th>
            </tr>
          </thead>
          <tbody>
            @for (item of calcService.shipmentItems(); track item.id; let i = $index) {
              <tr>
                <td>{{ i + 1 }}</td>
                <td style="display: flex; justify-content: center;">
                  <div [style.background]="item.color" style="width: 20px; height: 20px; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1);"></div>
                </td>
                <td>{{ item.length }} × {{ item.width }} × {{ item.height }} {{ unitLabel }}</td>
                <td>{{ item.quantity }}</td>
                <td [style.color]="item.placed < item.quantity ? '#ef4444' : 'inherit'">{{ item.placed }}</td>
                <td>{{ calcService.getRowVolumeM3(item) | number:'1.3-3' }} m³</td>
                <td>{{ calcService.getRowDensity(item) | number:'1.2-2' }}</td>
                <td>Class {{ calcService.freightClass() }}</td>
              </tr>
            }
            <tr class="total-row">
              <td colspan="3">Total / Average</td>
              <td>{{ totalQty }}</td>
              <td>{{ totalPlaced }}</td>
              <td>
                <div>{{ calcService.totalVolumeM3() | number:'1.3-3' }} m³</div>
                <div style="font-size: 0.7rem; font-weight: normal;">({{ calcService.totalVolumeM3() | number:'1.3-3' }} m³ placed)</div>
              </td>
              <td>{{ calcService.densityLbFt3() | number:'1.2-2' }}</td>
              <td>Class {{ calcService.freightClass() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Detailed Summary Dashboard -->
      <div class="card">
        <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
           <h2 style="font-size: 1rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Detailed Summary
          </h2>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Placement efficiency: <strong>{{ calcService.placementEfficiency() | number:'1.1-1' }}%</strong></span>
        </div>

        <div class="summary-grid-3">
          <!-- Volume Analysis -->
          <div class="analysis-box">
            <h4 class="analysis-title">📦 Volume Analysis</h4>
            <ul class="analysis-list">
              <li>Total: <strong>{{ calcService.totalVolumeM3() | number:'1.3-3' }} m³</strong></li>
              <li>Placed: <strong>{{ calcService.totalVolumeM3() | number:'1.3-3' }} m³</strong> ({{ calcService.placementEfficiency() | number:'1.1-1' }}%)</li>
              <li>In ft³: <strong>{{ calcService.totalVolumeFt3() | number:'1.3-3' }} ft³</strong></li>
              <li>Container fill: <strong>{{ (calcService.totalVolumeM3() / calcService.containerVolumeM3()) * 100 | number:'1.1-1' }}%</strong></li>
            </ul>
          </div>

          <!-- Weight & Density -->
          <div class="analysis-box">
            <h4 class="analysis-title">⚖️ Weight & Density</h4>
            <ul class="analysis-list">
              <li>Weight: <strong>{{ calcService.totalWeightKg() | number:'1.1-1' }} kg</strong></li>
              <li>In Lbs: <strong>{{ calcService.totalWeightLb() | number:'1.1-1' }} lb</strong></li>
              <li>Avg density: <strong>{{ calcService.densityLbFt3() | number:'1.2-2' }} lb/ft³</strong></li>
              <li>Containers needed: <strong>{{ calcService.containersNeeded() }}</strong></li>
            </ul>
          </div>

          <!-- Freight Analysis -->
          <div class="analysis-box">
            <h4 class="analysis-title">🚛 Freight Analysis</h4>
            <ul class="analysis-list">
              <li>Freight Class: <span class="badge badge-red">CLASS {{ calcService.freightClass() }}</span></li>
              <li style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">Dense, heavy items (metal products, machinery, bricks)</li>
              <li style="font-size: 0.75rem; color: var(--text-muted);">Based on: NMFC density standards</li>
              <li style="font-size: 0.75rem; color: var(--text-muted);">Note: Actual class may vary by carrier</li>
            </ul>
          </div>
        </div>

        <!-- Simulation Notes -->
        <div class="notes-box">
           <div style="color: var(--primary); font-weight: bold; display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; margin-bottom: 0.5rem;">
            ℹ️ Simulation Notes:
           </div>
           <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;">
            1) Placement algorithm tries to maximize container space usage. 
            2) Freight class is estimated based on density (lb/ft³). 
            3) Actual LTL classification may consider additional factors.
           </p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .detail-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }
    .detail-table th {
      text-align: left;
      padding: 1rem;
      background: #f8fafc;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-color);
      font-weight: 600;
    }
    .detail-table td {
      padding: 1rem;
      border-bottom: 1px solid #f8fafc;
      color: var(--text-main);
    }
    .total-row td {
      background: #fdfdfd;
      font-weight: 700;
      border-top: 2px solid var(--border-color);
    }
    .summary-grid-3 {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1.5rem;
    }
    @media (min-width: 1024px) {
      .summary-grid-3 { grid-template-columns: repeat(3, 1fr); }
    }
    .analysis-box {
      border: 1px solid #f1f5f9;
      border-radius: 8px;
      padding: 1.25rem;
    }
    .analysis-title {
      font-size: 0.9rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #92400e; /* Ochre/Brown look from image */
    }
    .analysis-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.85rem;
    }
    .analysis-list li::before {
      content: "•";
      margin-right: 0.5rem;
      color: var(--text-muted);
    }
    .badge-red {
      background: #ef4444;
      color: white;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      font-weight: 800;
      font-size: 0.7rem;
    }
    .notes-box {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
    }
  `]
})
export class DetailedSummaryComponent {
    calcService = inject(CbmCalculationService);

    get unitLabel() { return this.calcService.unitSystem() === 'metric' ? 'cm' : 'in'; }

    get totalQty() {
        return this.calcService.shipmentItems().reduce((acc, item) => acc + item.quantity, 0);
    }

    get totalPlaced() {
        return this.calcService.shipmentItems().reduce((acc, item) => acc + item.placed, 0);
    }
}
