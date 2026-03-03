export type UnitSystem = 'metric' | 'imperial';

export interface ShipmentItem {
  id: string;
  width: number; // in cm (metric) or inch (imperial)
  length: number;
  height: number;
  quantity: number;
  weight: number; // in kg (metric) or lb (imperial)
  volumeM3: number;
  color: string;
  placed: number;
}

export interface Container {
  name: string;
  internalWidthM: number;
  internalLengthM: number;
  internalHeightM: number;
  maxWeightKg: number;
}

export const CONTAINER_TYPES: Container[] = [
  {
    name: "20' Dry Container (20DC)",
    internalWidthM: 2.35,
    internalLengthM: 5.9,
    internalHeightM: 2.39,
    maxWeightKg: 28000
  },
  {
    name: "40' Dry Container (40DC)",
    internalWidthM: 2.35,
    internalLengthM: 12.03,
    internalHeightM: 2.39,
    maxWeightKg: 30480
  },
  {
    name: "40' High Cube (40HC)",
    internalWidthM: 2.35,
    internalLengthM: 12.03,
    internalHeightM: 2.69,
    maxWeightKg: 30480
  }
];
