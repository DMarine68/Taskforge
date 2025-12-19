import * as THREE from 'three';

export class TileGrid {
  constructor(scene, width, height) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.tileSize = 1;
    this.tiles = [];
  }

  create() {
    // Create custom grid that aligns with tile edges
    // Tiles are centered at (x - width/2) * tileSize
    // So tile edges are at (x - width/2) * tileSize ± tileSize/2
    const gridGroup = new THREE.Group();
    const gridMaterial = new THREE.LineBasicMaterial({ 
      color: 0xFFFFFF,
      opacity: 0.5,
      transparent: true
    });
    
    // Calculate grid bounds
    const minX = (-this.width / 2) * this.tileSize - this.tileSize / 2;
    const maxX = (this.width / 2) * this.tileSize + this.tileSize / 2;
    const minZ = (-this.height / 2) * this.tileSize - this.tileSize / 2;
    const maxZ = (this.height / 2) * this.tileSize + this.tileSize / 2;
    
    // Draw vertical lines (along Z axis)
    for (let x = 0; x <= this.width; x++) {
      const worldX = (x - this.width / 2) * this.tileSize - this.tileSize / 2;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(worldX, 0, minZ),
        new THREE.Vector3(worldX, 0, maxZ)
      ]);
      const line = new THREE.Line(geometry, gridMaterial);
      gridGroup.add(line);
    }
    
    // Draw horizontal lines (along X axis)
    for (let z = 0; z <= this.height; z++) {
      const worldZ = (z - this.height / 2) * this.tileSize - this.tileSize / 2;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(minX, 0, worldZ),
        new THREE.Vector3(maxX, 0, worldZ)
      ]);
      const line = new THREE.Line(geometry, gridMaterial);
      gridGroup.add(line);
    }
    
    gridGroup.position.y = 0.01; // Slightly above ground
    this.scene.add(gridGroup);
    this.gridHelper = gridGroup;

    // Initialize tile data structure
    for (let x = 0; x < this.width; x++) {
      this.tiles[x] = [];
      for (let z = 0; z < this.height; z++) {
        this.tiles[x][z] = {
          x: x,
          z: z,
          walkable: true,
          occupied: false,
          worldX: (x - this.width / 2) * this.tileSize,
          worldZ: (z - this.height / 2) * this.tileSize
        };
      }
    }
  }

  getTileAtWorldPosition(worldX, worldZ) {
    const gridX = Math.floor(worldX / this.tileSize + this.width / 2);
    const gridZ = Math.floor(worldZ / this.tileSize + this.height / 2);
    
    if (gridX >= 0 && gridX < this.width && gridZ >= 0 && gridZ < this.height) {
      return this.tiles[gridX][gridZ];
    }
    return null;
  }

  getTileAt(worldX, worldZ) {
    const gridX = Math.floor(worldX / this.tileSize + this.width / 2);
    const gridZ = Math.floor(worldZ / this.tileSize + this.height / 2);
    
    if (gridX >= 0 && gridX < this.width && gridZ >= 0 && gridZ < this.height) {
      return this.tiles[gridX][gridZ];
    }
    return null;
  }

  getWorldPosition(tileX, tileZ) {
    return {
      x: (tileX - this.width / 2) * this.tileSize,
      z: (tileZ - this.height / 2) * this.tileSize
    };
  }

  isWalkable(tileX, tileZ) {
    const tile = this.tiles[tileX]?.[tileZ];
    return tile ? tile.walkable && !tile.occupied : false;
  }
}

