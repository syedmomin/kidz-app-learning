import { Injectable, NgZone, ElementRef, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ShipmentItem, Container } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class ThreeSceneService implements OnDestroy {
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private controls!: OrbitControls;
    private containerMesh?: THREE.LineSegments;
    private boxGroup = new THREE.Group();
    private animationId?: number;

    constructor(private ngZone: NgZone) { }

    initScene(canvasContainer: ElementRef): void {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#f8fafc');

        const width = canvasContainer.nativeElement.clientWidth;
        const height = canvasContainer.nativeElement.clientHeight;

        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(5, 5, 5);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        canvasContainer.nativeElement.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);

        this.scene.add(this.boxGroup);

        this.animate();
    }

    private animate(): void {
        this.ngZone.runOutsideAngular(() => {
            const loop = () => {
                this.animationId = requestAnimationFrame(loop);
                this.controls.update();
                this.renderer.render(this.scene, this.camera);
            };
            loop();
        });
    }

    renderContainer(container: Container): void {
        if (this.containerMesh) {
            this.scene.remove(this.containerMesh);
        }

        const { internalWidthM, internalLengthM, internalHeightM } = container;
        const geometry = new THREE.BoxGeometry(internalLengthM, internalHeightM, internalWidthM);
        const edges = new THREE.EdgesGeometry(geometry);
        this.containerMesh = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: '#1e293b', opacity: 0.3, transparent: true }));
        this.scene.add(this.containerMesh);
    }

    renderItems(items: ShipmentItem[], container: Container, unitSystem: 'metric' | 'imperial'): void {
        this.boxGroup.clear();

        let curX = -container.internalLengthM / 2;
        let curY = -container.internalHeightM / 2;
        let curZ = -container.internalWidthM / 2;

        const maxHeight = container.internalHeightM;
        const maxWidth = container.internalWidthM;
        const maxLength = container.internalLengthM;

        let rowMaxHeight = 0;
        let layerMaxDepth = 0;

        items.forEach(item => {
            // Input conversion for rendering - everything converted to Meters for Three.js scene
            const scale = unitSystem === 'metric' ? 0.01 : 0.0254; // cm to m OR inch to m
            const itemWidthM = item.width * scale;
            const itemHeightM = item.height * scale;
            const itemLengthM = item.length * scale;

            item.placed = 0;

            for (let i = 0; i < item.quantity; i++) {
                // Grid Stacking with check
                if (curX + itemLengthM > maxLength / 2) {
                    curX = -maxLength / 2;
                    curZ += layerMaxDepth;
                    layerMaxDepth = 0;
                }

                if (curZ + itemWidthM > maxWidth / 2) {
                    curZ = -maxWidth / 2;
                    curY += rowMaxHeight;
                    rowMaxHeight = 0;
                }

                const fits = (curY + itemHeightM <= maxHeight / 2);

                if (fits) {
                    const geometry = new THREE.BoxGeometry(itemLengthM, itemHeightM, itemWidthM);
                    const material = new THREE.MeshPhongMaterial({
                        color: item.color,
                        transparent: true,
                        opacity: 0.9
                    });
                    const mesh = new THREE.Mesh(geometry, material);

                    mesh.position.set(
                        curX + itemLengthM / 2,
                        curY + itemHeightM / 2,
                        curZ + itemWidthM / 2
                    );

                    this.boxGroup.add(mesh);
                    item.placed++;

                    // Update markers
                    curX += itemLengthM;
                    rowMaxHeight = Math.max(rowMaxHeight, itemHeightM);
                    layerMaxDepth = Math.max(layerMaxDepth, itemWidthM);
                }
            }
        });
    }

    onResize(width: number, height: number): void {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    ngOnDestroy(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.renderer?.dispose();
        this.scene?.clear();
    }
}
