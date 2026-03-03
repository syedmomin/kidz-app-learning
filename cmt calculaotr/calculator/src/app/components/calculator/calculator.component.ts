import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CbmCalculationService } from '../../services/cbm-calculation.service';
import { CONTAINER_TYPES } from '../../models/models';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 1rem;">Shipment Details</h2>
      
      <div class="form-group">
        <label class="form-label">Select Container</label>
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

      <div class="shipment-items">
        @for (item of calcService.shipmentItems(); track item.id) {
          <div class="shipment-row">
            <div class="form-group" style="margin-bottom: 0;">
              <span class="form-label" style="font-size: 0.75rem;">Qty</span>
              <input type="number" [(ngModel)]="item.quantity" (change)="calcService.updateItem(item.id, {quantity: item.quantity})" 
                class="form-control">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <span class="form-label" style="font-size: 0.75rem;">L (cm)</span>
              <input type="number" [(ngModel)]="item.lengthCm" (change)="calcService.updateItem(item.id, {lengthCm: item.lengthCm})"
                class="form-control">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <span class="form-label" style="font-size: 0.75rem;">W (cm)</span>
              <input type="number" [(ngModel)]="item.widthCm" (change)="calcService.updateItem(item.id, {widthCm: item.widthCm})"
                class="form-control">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <span class="form-label" style="font-size: 0.75rem;">H (cm)</span>
              <input type="number" [(ngModel)]="item.heightCm" (change)="calcService.updateItem(item.id, {heightCm: item.heightCm})"
                class="form-control">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <span class="form-label" style="font-size: 0.75rem;">Wt (kg)</span>
              <input type="number" [(ngModel)]="item.weightKg" (change)="calcService.updateItem(item.id, {weightKg: item.weightKg})"
                class="form-control">
            </div>
            <div style="display: flex; justify-content: flex-end;">
              <button (click)="calcService.removeItem(item.id)" class="remove-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
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
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class CalculatorComponent {
  calcService = inject(CbmCalculationService);
  containerTypes = CONTAINER_TYPES;

  addItem() {
    this.calcService.addItem({
      widthCm: 40,
      lengthCm: 60,
      heightCm: 40,
      quantity: 10,
      weightKg: 15,
      color: this.getRandomPastelColor()
    });
  }

  private getRandomPastelColor() {
    return `hsl(${Math.random() * 360}, 70%, 80%)`;
  }
}
