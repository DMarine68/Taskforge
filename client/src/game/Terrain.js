import * as THREE from 'three';

export class Terrain {
  constructor(scene, tileGrid, width, height) {
    this.scene = scene;
    this.tileGrid = tileGrid;
    this.width = width;
    this.height = height;
    this.tileSize = tileGrid.tileSize;
    this.mesh = null;
  }

  create() {
    // Create terrain based on tile types from TileGrid
    const terrainGroup = new THREE.Group();
    
    // Group tiles by type for efficient rendering
    const tilesByType = new Map();
    
    // Collect tiles by type
    for (let x = 0; x < this.width; x++) {
      for (let z = 0; z < this.height; z++) {
        const tile = this.tileGrid.getTile(x, z);
        if (!tile) continue;
        
        const tileType = tile.type || 'grass';
        if (!tilesByType.has(tileType)) {
          tilesByType.set(tileType, []);
        }
        tilesByType.get(tileType).push({
          worldX: tile.worldX,
          worldZ: tile.worldZ,
          tileX: tile.tileX,
          tileZ: tile.tileZ
        });
      }
    }
    
    // Create merged terrain for each tile type
    tilesByType.forEach((tiles, tileType) => {
      this.createMergedTerrain(terrainGroup, tiles, tileType);
    });
    
    // Add small decorative flowers on grass tiles
    this.addFlowers(terrainGroup);
    
    terrainGroup.position.y = 0;
    this.scene.add(terrainGroup);
    this.mesh = terrainGroup;
  }

  createMergedTerrain(terrainGroup, tiles, tileType) {
    if (tiles.length === 0) return;
    
    // Get color for tile type
    const color = this.getColorForTileType(tileType);
    
    // Group tiles by color variations (for checkerboard patterns, etc.)
    const tilesByColor = new Map();
    
    tiles.forEach(tile => {
      // Apply checkerboard pattern for grass tiles
      let finalColor = color;
      if (tileType === 'grass' && (tile.tileX + tile.tileZ) % 2 === 0) {
        const lighterColor = new THREE.Color(color).lerp(new THREE.Color(0xFFFFFF), 0.1);
        finalColor = lighterColor.getHex();
      }
      
      const colorKey = finalColor.toString();
      if (!tilesByColor.has(colorKey)) {
        tilesByColor.set(colorKey, []);
      }
      tilesByColor.get(colorKey).push(tile);
    });
    
    // Create a single geometry that we'll reuse
    const tileGeometry = new THREE.PlaneGeometry(this.tileSize, this.tileSize);
    tileGeometry.rotateX(-Math.PI / 2); // Rotate to lie flat
    
    // Create meshes grouped by color for better performance
    tilesByColor.forEach((colorTiles, colorKey) => {
      const colorValue = parseInt(colorKey);
      const material = new THREE.MeshStandardMaterial({ 
        color: colorValue,
        roughness: 0.8,
        metalness: 0.1
      });
      
      // Create individual meshes for each tile
      colorTiles.forEach(tile => {
        const mesh = new THREE.Mesh(tileGeometry.clone(), material);
        mesh.position.set(tile.worldX, 0, tile.worldZ);
        mesh.receiveShadow = true;
        terrainGroup.add(mesh);
      });
    });
    
    tileGeometry.dispose();
  }

  getColorForTileType(tileType) {
    switch (tileType) {
      case 'grass':
        return 0x90EE90; // Light green
      case 'dirt':
        return 0x8B7355; // Warm brown
      case 'water':
        return 0x4682B4; // Steel blue
      case 'farmable':
        return 0xDEB887; // Burlywood (farmable soil)
      default:
        return 0x90EE90; // Default to grass
    }
  }

  addFlowers(terrainGroup) {
    // Add small decorative flowers on grass tiles
    const flowerCount = Math.min(100, Math.floor(this.width * this.height * 0.02)); // 2% of tiles, max 100
    
    for (let i = 0; i < flowerCount; i++) {
      const tileX = Math.floor(Math.random() * this.width);
      const tileZ = Math.floor(Math.random() * this.height);
      const tile = this.tileGrid.getTile(tileX, tileZ);
      
      if (tile && tile.type === 'grass') {
        const flowerGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const flowerMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xFFFACD, // Light yellow/off-white
          roughness: 0.7
        });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.set(tile.worldX, 0.05, tile.worldZ);
        terrainGroup.add(flower);
      }
    }
  }

  // Update terrain when tile type changes
  updateTileType(tileX, tileZ, newType) {
    // This would require more complex mesh management
    // For now, we'll regenerate the terrain mesh
    // In a production system, you'd update individual tile meshes
    if (this.mesh) {
      this.scene.remove(this.mesh);
      // Clean up old meshes
      this.mesh.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }
    this.create();
  }
}
