import { Component, ElementRef, ViewChild, AfterViewInit, inject, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeSceneService } from '../../services/three-scene.service';
import { CbmCalculationService } from '../../services/cbm-calculation.service';

@Component({
  selector: 'app-container-3d',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #canvasContainer class="canvas-container shadow-inner relative">
      <div class="viewer-overlay">
        Left-click to Rotate | Right-click to Pan | Scroll to Zoom
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .canvas-container { 
      width: 100%;
      height: 100%;
      min-height: 400px;
      background: #f8fafc;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      position: relative;
    }
    .viewer-overlay {
      position: absolute;
      top: 1rem;
      left: 1rem;
      z-index: 10;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(4px);
      padding: 0.5rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-family: monospace;
      color: #64748b;
      border: 1px solid #e2e8f0;
    }
  `]
})
export class Container3DComponent implements AfterViewInit {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;

  threeService = inject(ThreeSceneService);
  calcService = inject(CbmCalculationService);

  constructor() {
    effect(() => {
      const container = this.calcService.selectedContainer();
      this.threeService.renderContainer(container);
    });

    effect(() => {
      const items = this.calcService.shipmentItems();
      const container = this.calcService.selectedContainer();
      this.threeService.renderItems(items, container);
    });
  }

  ngAfterViewInit(): void {
    this.threeService.initScene(this.canvasContainer);

    const container = this.calcService.selectedContainer();
    this.threeService.renderContainer(container);
    this.threeService.renderItems(this.calcService.shipmentItems(), container);
  }

  @HostListener('window:resize')
  onResize() {
    const width = this.canvasContainer.nativeElement.clientWidth;
    const height = this.canvasContainer.nativeElement.clientHeight;
    this.threeService.onResize(width, height);
  }
}
