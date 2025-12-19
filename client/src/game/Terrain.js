import * as THREE from 'three';

export class Terrain {
  constructor(scene, width, height) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.tileSize = 1;
  }

  create() {
    // Create terrain with two biomes: forest (brown) on left, grass (green) on right
    const terrainGroup = new THREE.Group();
    
    // Create individual tiles for biome blending
    for (let x = 0; x < this.width; x++) {
      for (let z = 0; z < this.height; z++) {
        const worldX = (x - this.width / 2) * this.tileSize;
        const worldZ = (z - this.height / 2) * this.tileSize;
        
        // Determine biome based on position (left = forest, right = grass)
        // Create diagonal boundary with blending
        const normalizedX = x / this.width;
        const normalizedZ = z / this.height;
        const diagonalValue = normalizedX + normalizedZ; // Creates diagonal split
        
        let color;
        if (diagonalValue < 0.8) {
          // Forest biome (brown)
          color = 0x8B7355; // Warm brown
        } else if (diagonalValue > 1.2) {
          // Grass biome (green)
          color = 0x90EE90; // Light green
        } else {
          // Blending zone - mix colors
          const blendFactor = (diagonalValue - 0.8) / 0.4; // 0 to 1
          const brown = new THREE.Color(0x8B7355);
          const green = new THREE.Color(0x90EE90);
          color = brown.lerp(green, blendFactor).getHex();
        }
        
        // Create tile with checkerboard pattern for grass area
        const isGrass = diagonalValue > 1.0;
        if (isGrass && (x + z) % 2 === 0) {
          // Alternate checkerboard pattern
          const lighterGreen = new THREE.Color(color).lerp(new THREE.Color(0xFFFFFF), 0.1);
          color = lighterGreen.getHex();
        }
        
        // Create tile
        const tileGeometry = new THREE.PlaneGeometry(this.tileSize, this.tileSize);
        const tileMaterial = new THREE.MeshStandardMaterial({ 
          color: color,
          roughness: 0.8,
          metalness: 0.1
        });
        const tile = new THREE.Mesh(tileGeometry, tileMaterial);
        tile.rotation.x = -Math.PI / 2;
        tile.position.set(worldX, 0, worldZ);
        tile.receiveShadow = true;
        terrainGroup.add(tile);
      }
    }
    
    // Add small decorative flowers on grass tiles
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * this.width;
      const z = Math.random() * this.height;
      const normalizedX = x / this.width;
      const normalizedZ = z / this.height;
      const diagonalValue = normalizedX + normalizedZ;
      
      // Only place flowers on grass side
      if (diagonalValue > 1.0) {
        const worldX = (x - this.width / 2) * this.tileSize;
        const worldZ = (z - this.height / 2) * this.tileSize;
        
        const flowerGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const flowerMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xFFFACD, // Light yellow/off-white
          roughness: 0.7
        });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.set(worldX, 0.05, worldZ);
        terrainGroup.add(flower);
      }
    }
    
    terrainGroup.position.y = 0;
    this.scene.add(terrainGroup);
    this.mesh = terrainGroup;
  }
}


