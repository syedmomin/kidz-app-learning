# CBM Calculator Library

A high-performance **Angular 21** library for **CBM (Cubic Meter) calculation** with **3D container loading simulation** using Three.js.

## Features

- 🏗️ **CBM Calculation**: Accurate volume and weight calculations for shipping items.
- 📦 **Container Selection**: Pre-defined container types (20ft, 40ft, etc.) with internal dimensions.
- 🎮 **3D Visualization**: Interactive 3D simulation of container loading using Three.js.
- 📊 **Detailed Summaries**: Comprehensive breakdown of shipment metrics and freight classes.
- 📏 **Dual Unit Support**: Seamless switching between Metric (cm, m³, kg) and Imperial (inch, ft³, lb) systems.
- 🧩 **Modular Components**: Standalone components that can be used independently (e.g., 3D Viewer, Summary Panels).

## Installation

```bash
npm install cbm-calculator
```

## Live Demo & NPM

- **NPM Package**: [https://www.npmjs.com/package/cbm-calculator](https://www.npmjs.com/package/cbm-calculator)
- **Live Demo**: [https://cbm-calculator.demo.com](https://cbm-calculator.demo.com)

## Usage

### 1. Standalone Component Usage

The library provides several standalone components that can be used together or independently to build your custom layout.

```typescript
import { 
  CalculatorComponent, 
  SummaryComponent, 
  Container3DComponent, 
  DetailedSummaryComponent 
} from 'cbm-calculator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CalculatorComponent, 
    SummaryComponent, 
    Container3DComponent, 
    DetailedSummaryComponent
  ],
  template: `
    <div class="calculator-layout">
      <!-- You can use components independently -->
      <app-calculator></app-calculator>
      <app-container-3d></app-container-3d>
      <app-summary></app-summary>
    </div>
  `
})
export class AppComponent { }
```

### 2. Styles

Ensure you include the necessary CSS variables for the components to look premium.

```css
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --bg-main: #f1f5f9;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
}
```

## Components API

### `CalculatorComponent`
The main interface for entering shipment items and selecting container types.

### `Container3DComponent`
A Three.js powered viewer that visualizes the current loading state. Can be used as a standalone viewer for shipment data.

### `SummaryComponent` & `DetailedSummaryComponent`
Display calculated metrics like total volume, weight, freight class, and efficiency. These can be placed anywhere in your UI independently of the 3D viewer.

## Requirements
- Angular 21.x
- Three.js 0.183.x

## License
MIT © Antigravity AI

