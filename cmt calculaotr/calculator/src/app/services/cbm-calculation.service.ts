import { Injectable, signal, computed } from '@angular/core';
import { ShipmentItem, Container, CONTAINER_TYPES, UnitSystem } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class CbmCalculationService {
    shipmentItems = signal<ShipmentItem[]>([]);
    selectedContainer = signal<Container>(CONTAINER_TYPES[0]);
    unitSystem = signal<UnitSystem>('metric');

    totalVolumeM3 = computed(() => {
        return this.shipmentItems().reduce((acc, item) => {
            // item.volumeM3 is always stored in M3 regardless of input units
            return acc + item.volumeM3;
        }, 0);
    });

    totalWeightKg = computed(() => {
        return this.shipmentItems().reduce((acc, item) => {
            const weight = item.weight * item.quantity;
            return acc + (this.unitSystem() === 'metric' ? weight : weight / 2.20462);
        }, 0);
    });

    totalVolumeFt3 = computed(() => {
        return this.totalVolumeM3() * 35.3147;
    });

    totalWeightLb = computed(() => {
        return this.totalWeightKg() * 2.20462;
    });

    densityLbFt3 = computed(() => {
        const vol = this.totalVolumeFt3();
        return vol > 0 ? this.totalWeightLb() / vol : 0;
    });

    freightClass = computed(() => {
        const d = this.densityLbFt3();
        const table = [
            { min: 50, class: '50' },
            { min: 35, class: '55' },
            { min: 30, class: '60' },
            { min: 22.5, class: '65' },
            { min: 15, class: '70' },
            { min: 13.5, class: '77.5' },
            { min: 12, class: '85' },
            { min: 10.5, class: '92.5' },
            { min: 9, class: '100' },
            { min: 8, class: '110' },
            { min: 7, class: '125' },
            { min: 6, class: '150' },
            { min: 5, class: '175' },
            { min: 4, class: '200' },
            { min: 3, class: '250' },
            { min: 2, class: '300' },
            { min: 1, class: '400' },
            { min: 0, class: '500' }
        ];
        const match = table.find(row => d >= row.min);
        return match ? match.class : '500';
    });

    containerVolumeM3 = computed(() => {
        const c = this.selectedContainer();
        return c.internalWidthM * c.internalHeightM * c.internalLengthM;
    });

    containersNeeded = computed(() => {
        const needed = Math.ceil(this.totalVolumeM3() / this.containerVolumeM3());
        return needed || 0;
    });

    placementEfficiency = computed(() => {
        const totalPlaced = this.shipmentItems().reduce((acc, item) => acc + item.placed, 0);
        const totalQty = this.shipmentItems().reduce((acc, item) => acc + item.quantity, 0);
        return totalQty > 0 ? (totalPlaced / totalQty) * 100 : 0;
    });

    calculateItemVolumeM3(item: Partial<ShipmentItem>, system: UnitSystem): number {
        const w = item.width || 0;
        const l = item.length || 0;
        const h = item.height || 0;
        const q = item.quantity || 0;

        if (system === 'metric') {
            // cm to m3
            return (w * l * h * q) / 1000000;
        } else {
            // inch to m3: (1 inch = 0.0254 m)
            const wM = w * 0.0254;
            const lM = l * 0.0254;
            const hM = h * 0.0254;
            return (wM * lM * hM * q);
        }
    }

    addItem(item: Omit<ShipmentItem, 'id' | 'volumeM3' | 'placed'>) {
        const id = Math.random().toString(36).substring(2, 9);
        const volumeM3 = this.calculateItemVolumeM3(item, this.unitSystem());
        this.shipmentItems.update(items => [...items, { ...item, id, volumeM3, placed: item.quantity }]);
    }

    removeItem(id: string) {
        this.shipmentItems.update(items => items.filter(i => i.id !== id));
    }

    updateItem(id: string, updates: Partial<ShipmentItem>) {
        this.shipmentItems.update(items => items.map(i => {
            if (i.id === id) {
                const updated = { ...i, ...updates };
                updated.volumeM3 = this.calculateItemVolumeM3(updated, this.unitSystem());
                return updated;
            }
            return i;
        }));
    }

    // Helper to get total CBM for a specific row
    getRowVolumeM3(item: ShipmentItem): number {
        return item.volumeM3;
    }

    // Helper to get density for a specific row (lb/ft3)
    getRowDensity(item: ShipmentItem): number {
        const volFt3 = item.volumeM3 * 35.3147;
        const weightLb = (this.unitSystem() === 'metric' ? item.weight : item.weight) * item.quantity * (this.unitSystem() === 'metric' ? 2.20462 : 1);
        return volFt3 > 0 ? weightLb / volFt3 : 0;
    }
}
