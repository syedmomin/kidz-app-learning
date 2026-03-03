import { Injectable, signal, computed } from '@angular/core';
import { ShipmentItem, Container, CONTAINER_TYPES } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class CbmCalculationService {
    shipmentItems = signal<ShipmentItem[]>([]);
    selectedContainer = signal<Container>(CONTAINER_TYPES[0]);

    totalVolumeM3 = computed(() => {
        return this.shipmentItems().reduce((acc, item) => acc + item.volumeM3, 0);
    });

    totalWeightKg = computed(() => {
        return this.shipmentItems().reduce((acc, item) => acc + (item.weightKg * item.quantity), 0);
    });

    totalVolumeFt3 = computed(() => {
        return this.totalVolumeM3() * 35.3147;
    });

    totalWeightLb = computed(() => {
        return this.totalWeightKg() * 2.20462;
    });

    density = computed(() => {
        const vol = this.totalVolumeFt3();
        return vol > 0 ? this.totalWeightLb() / vol : 0;
    });

    freightClass = computed(() => {
        const d = this.density();
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

    calculateItemVolume(item: Partial<ShipmentItem>): number {
        const w = item.widthCm || 0;
        const l = item.lengthCm || 0;
        const h = item.heightCm || 0;
        const q = item.quantity || 0;
        return (w * l * h * q) / 1000000;
    }

    addItem(item: Omit<ShipmentItem, 'id' | 'volumeM3'>) {
        const id = Math.random().toString(36).substring(2, 9);
        const volumeM3 = this.calculateItemVolume(item);
        this.shipmentItems.update(items => [...items, { ...item, id, volumeM3 }]);
    }

    removeItem(id: string) {
        this.shipmentItems.update(items => items.filter(i => i.id !== id));
    }

    updateItem(id: string, updates: Partial<ShipmentItem>) {
        this.shipmentItems.update(items => items.map(i => {
            if (i.id === id) {
                const updated = { ...i, ...updates };
                updated.volumeM3 = this.calculateItemVolume(updated);
                return updated;
            }
            return i;
        }));
    }
}
