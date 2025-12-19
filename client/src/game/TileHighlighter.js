import * as THREE from 'three';

export class TileHighlighter {
  constructor(scene, tileGrid) {
    this.scene = scene;
    this.tileGrid = tileGrid;
    this.highlightMesh = null;
    this.currentTile = null;
    this.create();
  }

  create() {
    // Create highlight mesh (will be updated on hover)
    const geometry = new THREE.PlaneGeometry(this.tileGrid.tileSize, this.tileGrid.tileSize);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xFFFFFF,
      opacity: 0.2,
      transparent: true,
      side: THREE.DoubleSide
    });
    this.highlightMesh = new THREE.Mesh(geometry, material);
    this.highlightMesh.rotation.x = -Math.PI / 2;
    this.highlightMesh.position.y = 0.02;
    this.highlightMesh.visible = false;
    this.scene.add(this.highlightMesh);

    // Create border outline - custom rectangle in XZ plane (no rotation needed)
    const halfSize = this.tileGrid.tileSize / 2;
    const borderGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-halfSize, 0.021, -halfSize),
      new THREE.Vector3(halfSize, 0.021, -halfSize),
      new THREE.Vector3(halfSize, 0.021, halfSize),
      new THREE.Vector3(-halfSize, 0.021, halfSize),
      new THREE.Vector3(-halfSize, 0.021, -halfSize) // Close the loop
    ]);
    const edgeMaterial = new THREE.LineBasicMaterial({ 
      color: 0xFFFFFF,
      linewidth: 2
    });
    this.borderLines = new THREE.Line(borderGeometry, edgeMaterial);
    this.borderLines.visible = false;
    this.scene.add(this.borderLines);
  }

  update(worldX, worldZ) {
    const tile = this.tileGrid.getTileAtWorldPosition(worldX, worldZ);
    
    if (tile && tile !== this.currentTile) {
      this.currentTile = tile;
      
      // Position highlight at tile center
      this.highlightMesh.position.set(tile.worldX, 0.02, tile.worldZ);
      this.highlightMesh.visible = true;
      
      // Update border position (geometry is already in world space, so translate it)
      this.borderLines.position.set(tile.worldX, 0, tile.worldZ);
      this.borderLines.visible = true;
    } else if (!tile) {
      // Hide highlight if no tile
      this.highlightMesh.visible = false;
      this.borderLines.visible = false;
      this.currentTile = null;
    }
  }

  hide() {
    this.highlightMesh.visible = false;
    this.borderLines.visible = false;
    this.currentTile = null;
  }
}

