# CMT Calculator Library

A high-performance Angular library for **CBM (Cubic Meter) calculation** with **3D container loading simulation** using Three.js.

## Features

- 🏗️ **CBM Calculation**: Accurate volume and weight calculations for shipping items.
- 📦 **Container Selection**: Pre-defined container types (20ft, 40ft, etc.) with internal dimensions.
- 🎮 **3D Visualization**: Interactive 3D simulation of container loading using Three.js.
- 📊 **Detailed Summaries**: Comprehensive breakdown of shipment metrics and freight classes.
- 📏 **Dual Unit Support**: Seamless switching between Metric (cm, m³, kg) and Imperial (inch, ft³, lb) systems.

## Installation

```bash
npm install cmt-calculator
```

## Usage

### 1. Import the Components

The library provides several standalone components that can be used together or independently.

```typescript
import { 
  CalculatorComponent, 
  SummaryComponent, 
  Container3DComponent, 
  DetailedSummaryComponent 
} from 'cmt-calculator';

@Component({
  standalone: true,
  imports: [
    CalculatorComponent, 
    SummaryComponent, 
    Container3DComponent, 
    DetailedSummaryComponent
  ],
  // ...
})
export class MyComponent { }
```

### 2. Styles

Ensure you include the necessary CSS variables for the components to look premium. The components use a CSS variable-based design system.

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
A Three.js powered viewer that visualizes the current loading state.

### `SummaryComponent` & `DetailedSummaryComponent`
Display calculated metrics like total volume, weight, freight class, and efficiency.

## License
MIT © Antigravity AI

