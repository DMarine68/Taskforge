import * as THREE from 'three';
import { WorldObject } from './WorldObject.js';
import { Resource } from './Resource.js';

export class Tree extends WorldObject {
  constructor(scene, tileGrid, tileX, tileZ, sizeVariation = 1.0) {
    super(scene, tileGrid, tileX, tileZ);
    this.health = 3;
    this.maxHealth = 3;
    this.isChopped = false;
    this.sizeVariation = sizeVariation; // 0.7 to 1.3 for size variation
    this.create();
  }

  create() {
    // Create multi-tiered low-poly evergreen tree matching the image style
    const group = new THREE.Group();
    const scale = this.sizeVariation;

    // Trunk (dark brown, cylindrical, low-poly)
    const trunkHeight = 1.5 * scale;
    const trunkTopRadius = 0.2 * scale;
    const trunkBottomRadius = 0.25 * scale;
    const trunkGeometry = new THREE.CylinderGeometry(trunkTopRadius, trunkBottomRadius, trunkHeight, 6); // Low poly with 6 sides
    const trunkMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513, // Dark brown
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true // Low-poly faceted look
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = trunkHeight / 2; // Center trunk at half its height
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);

    // Multi-tiered canopy - bottom tier (largest, darker green)
    const bottomTierHeight = 1.2 * scale;
    const bottomTierRadius = 1.0 * scale;
    const bottomTierGeometry = new THREE.ConeGeometry(bottomTierRadius, bottomTierHeight, 6);
    const bottomTierMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2E8B57, // Darker emerald green (shadow areas)
      roughness: 0.7,
      metalness: 0.1,
      flatShading: true
    });
    const bottomTier = new THREE.Mesh(bottomTierGeometry, bottomTierMaterial);
    bottomTier.position.y = trunkHeight + bottomTierHeight / 2;
    bottomTier.castShadow = true;
    bottomTier.receiveShadow = true;
    group.add(bottomTier);

    // Middle tier (medium, teal-green)
    const middleTierHeight = 0.9 * scale;
    const middleTierRadius = 0.7 * scale;
    const middleTierGeometry = new THREE.ConeGeometry(middleTierRadius, middleTierHeight, 6);
    const middleTierMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x40E0D0, // Teal-green (medium shade)
      roughness: 0.7,
      metalness: 0.1,
      flatShading: true
    });
    const middleTier = new THREE.Mesh(middleTierGeometry, middleTierMaterial);
    middleTier.position.y = trunkHeight + bottomTierHeight + middleTierHeight / 2;
    middleTier.castShadow = true;
    middleTier.receiveShadow = true;
    group.add(middleTier);

    // Top tier (smallest, lighter green/teal)
    const topTierHeight = 0.6 * scale;
    const topTierRadius = 0.4 * scale;
    const topTierGeometry = new THREE.ConeGeometry(topTierRadius, topTierHeight, 6);
    const topTierMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x7FFFD4, // Lighter teal-green (highlight areas)
      roughness: 0.7,
      metalness: 0.1,
      flatShading: true
    });
    const topTier = new THREE.Mesh(topTierGeometry, topTierMaterial);
    topTier.position.y = trunkHeight + bottomTierHeight + middleTierHeight + topTierHeight / 2;
    topTier.castShadow = true;
    topTier.receiveShadow = true;
    group.add(topTier);

    // Position tree so bottom of trunk is on ground
    group.position.set(this.worldX, 0, this.worldZ);
    this.mesh = group;
    this.scene.add(this.mesh);
  }

  interact(player) {
    if (this.isChopped) return false;

    this.health--;
    
    // Visual feedback - shake tree
    if (this.mesh) {
      const originalX = this.mesh.position.x;
      const originalZ = this.mesh.position.z;
      this.mesh.position.x = originalX + (Math.random() - 0.5) * 0.1;
      this.mesh.position.z = originalZ + (Math.random() - 0.5) * 0.1;
      setTimeout(() => {
        if (this.mesh) {
          this.mesh.position.x = originalX;
          this.mesh.position.z = originalZ;
        }
      }, 100);
    }

    if (this.health <= 0) {
      this.chop();
      return true;
    }

    return false;
  }

  chop() {
    this.isChopped = true;
    
    // Remove tree mesh
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }

    // Free tile
    const tile = this.tileGrid.tiles[this.tileX]?.[this.tileZ];
    if (tile) {
      tile.occupied = false;
    }

    // Return resources to spawn (handled by SceneManager)
    return { type: 'wood', count: 2 + Math.floor(Math.random() * 2) };
  }
}

