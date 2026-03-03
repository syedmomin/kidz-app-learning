import {
  CalculatorComponent,
  SummaryComponent,
  Container3DComponent,
  DetailedSummaryComponent
} from 'cmt-calculator';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CalculatorComponent, SummaryComponent, Container3DComponent, DetailedSummaryComponent],
  template: `
    <div class="container">
      <header class="header">
        <h1>
          <span class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </span>
          CBM Calculator <span style="font-weight: 300; color: var(--text-muted);">& Container Loading Simulation with Freight Class</span>
        </h1>
      </header>

      <main class="main-layout">
        <div class="left-panel" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <app-calculator></app-calculator>
        </div>

        <div class="right-panel sticky-top" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <app-summary></app-summary>
          <div style="height: 400px;">
            <app-container-3d></app-container-3d>
          </div>
        </div>
      </main>

      <app-detailed-summary></app-detailed-summary>

      <footer style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border-color); text-align: center; color: var(--text-muted); font-size: 0.875rem;">
        Built with Angular 21 & Three.js • Premium Logistics Tools
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class App { }
