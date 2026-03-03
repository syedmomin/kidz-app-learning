import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CbmCalculationService } from '../../services/cbm-calculation.service';
import { CONTAINER_TYPES } from '../../models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Container & Units
      </h2>
      
      <div class="form-group">
        <label class="form-label">Container type</label>
        <select 
          [ngModel]="calcService.selectedContainer()"
          (ngModelChange)="calcService.selectedContainer.set($event)"
          class="form-control"
        >
          @for (c of containerTypes; track c.name) {
            <option [ngValue]="c">{{ c.name }}</option>
          }
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Unit system</label>
        <select 
          [ngModel]="calcService.unitSystem()"
          (ngModelChange)="calcService.unitSystem.set($event)"
          class="form-control"
          style="border-left: 4px solid var(--primary);"
        >
          <option value="metric">Metric (cm, m³, kg)</option>
          <option value="imperial">Imperial (inch, ft³, lb)</option>
        </select>
        
        <div style="margin-top: 1rem; padding: 1rem; background: #f8fafc; border-radius: 8px; font-size: 0.8rem; color: var(--text-muted); line-height: 1.6;">
          <div>Dimensions: <strong>{{ getContainerDims() }}</strong></div>
          <div>Volume: <strong>{{ calcService.containerVolumeM3() | number:'1.3-3' }} m³</strong></div>
          <div>Converted: <strong>{{ calcService.containerVolumeM3() * 35.3147 | number:'1.3-3' }} ft³</strong></div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem;">Shipment Items</h3>
        <div class="shipment-items">
          @for (item of calcService.shipmentItems(); track item.id; let i = $index) {
            <div class="shipment-row">
              <div class="form-group" style="margin-bottom: 0;">
                <span class="form-label" style="font-size: 0.75rem;">Qty</span>
                <input type="number" [(ngModel)]="item.quantity" (change)="calcService.updateItem(item.id, {quantity: item.quantity})" 
                  class="form-control">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <span class="form-label" style="font-size: 0.75rem;">L ({{ unitLabel }})</span>
                <input type="number" [(ngModel)]="item.length" (change)="calcService.updateItem(item.id, {length: item.length})"
                  class="form-control">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <span class="form-label" style="font-size: 0.75rem;">W ({{ unitLabel }})</span>
                <input type="number" [(ngModel)]="item.width" (change)="calcService.updateItem(item.id, {width: item.width})"
                  class="form-control">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <span class="form-label" style="font-size: 0.75rem;">H ({{ unitLabel }})</span>
                <input type="number" [(ngModel)]="item.height" (change)="calcService.updateItem(item.id, {height: item.height})"
                  class="form-control">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <span class="form-label" style="font-size: 0.75rem;">Wt ({{ weightLabel }})</span>
                <input type="number" [(ngModel)]="item.weight" (change)="calcService.updateItem(item.id, {weight: item.weight})"
                  class="form-control">
              </div>
              <div style="display: flex; justify-content: flex-end;">
                <button (click)="calcService.removeItem(item.id)" class="remove-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1-1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          }
        </div>

        <button (click)="addItem()" class="btn-primary" style="margin-top: 1rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Row
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class CalculatorComponent {
  calcService = inject(CbmCalculationService);
  containerTypes = CONTAINER_TYPES;

  get unitLabel() { return this.calcService.unitSystem() === 'metric' ? 'cm' : 'in'; }
  get weightLabel() { return this.calcService.unitSystem() === 'metric' ? 'kg' : 'lb'; }

  getContainerDims() {
    const c = this.calcService.selectedContainer();
    const system = this.calcService.unitSystem();
    if (system === 'metric') {
      return `${c.internalLengthM * 100} x ${c.internalWidthM * 100} x ${c.internalHeightM * 100} cm`;
    } else {
      // m to inch: * 39.3701
      return `${(c.internalLengthM * 39.3701).toFixed(0)} x ${(c.internalWidthM * 39.3701).toFixed(0)} x ${(c.internalHeightM * 39.3701).toFixed(0)} in`;
    }
  }

  addItem() {
    const system = this.calcService.unitSystem();
    this.calcService.addItem({
      width: system === 'metric' ? 40 : 16,
      length: system === 'metric' ? 60 : 24,
      height: system === 'metric' ? 40 : 16,
      quantity: 10,
      weight: system === 'metric' ? 15 : 33,
      color: this.getRandomPastelColor()
    });
  }

  private getRandomPastelColor() {
    return `hsl(${Math.random() * 360}, 70%, 80%)`;
  }
}
