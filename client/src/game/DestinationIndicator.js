import * as THREE from 'three';

export class DestinationIndicator {
  constructor(scene, tileGrid) {
    this.scene = scene;
    this.tileGrid = tileGrid;
    this.indicatorMesh = null;
    this.currentDestination = null;
    this.create();
  }

  create() {
    // Create a pulsing indicator at the destination tile
    const geometry = new THREE.PlaneGeometry(this.tileGrid.tileSize, this.tileGrid.tileSize);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x6FD6FF, // Signature color
      opacity: 0.4,
      transparent: true,
      side: THREE.DoubleSide,
      emissive: 0x6FD6FF,
      emissiveIntensity: 0.3
    });
    this.indicatorMesh = new THREE.Mesh(geometry, material);
    this.indicatorMesh.rotation.x = -Math.PI / 2;
    this.indicatorMesh.position.y = 0.03;
    this.indicatorMesh.visible = false;
    this.scene.add(this.indicatorMesh);

    // Create border outline in signature color
    const halfSize = this.tileGrid.tileSize / 2;
    const borderGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-halfSize, 0.031, -halfSize),
      new THREE.Vector3(halfSize, 0.031, -halfSize),
      new THREE.Vector3(halfSize, 0.031, halfSize),
      new THREE.Vector3(-halfSize, 0.031, halfSize),
      new THREE.Vector3(-halfSize, 0.031, -halfSize) // Close the loop
    ]);
    const edgeMaterial = new THREE.LineBasicMaterial({ 
      color: 0x6FD6FF,
      linewidth: 3
    });
    this.borderLines = new THREE.Line(borderGeometry, edgeMaterial);
    this.borderLines.visible = false;
    this.scene.add(this.borderLines);

    // Animation properties
    this.pulseTime = 0;
  }

  setDestination(tile) {
    if (tile) {
      this.currentDestination = tile;
      this.indicatorMesh.position.set(tile.worldX, 0.03, tile.worldZ);
      this.borderLines.position.set(tile.worldX, 0, tile.worldZ);
      this.indicatorMesh.visible = true;
      this.borderLines.visible = true;
      this.pulseTime = 0;
    } else {
      this.hide();
    }
  }

  hide() {
    this.indicatorMesh.visible = false;
    this.borderLines.visible = false;
    this.currentDestination = null;
  }

  update(deltaTime) {
    if (this.indicatorMesh.visible && this.currentDestination) {
      // Pulse animation
      this.pulseTime += deltaTime * 2; // Speed of pulse
      const pulse = Math.sin(this.pulseTime) * 0.15 + 0.4; // Oscillate between 0.25 and 0.55
      this.indicatorMesh.material.opacity = pulse;
      this.indicatorMesh.material.emissiveIntensity = pulse * 0.5;
    }
  }

  isVisible() {
    return this.indicatorMesh.visible;
  }
}


