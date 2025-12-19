import * as THREE from 'three';
import { Building } from './Building.js';
import { BuildingTypes, getBuildingType } from './BuildingTypes.js';
import { StorageInventory } from './StorageInventory.js';

export class BuildingManager {
  constructor(scene, tileGrid, player) {
    this.scene = scene;
    this.tileGrid = tileGrid;
    this.player = player;
    this.buildings = [];
    this.placementMode = false;
    this.selectedBuildingType = null;
    this.previewBuilding = null;
  }

  canPlaceBuilding(tileX, tileZ, buildingType) {
    const type = getBuildingType(buildingType);
    if (!type) return false;

    // Check if tiles are available
    for (let x = 0; x < type.size.width; x++) {
      for (let z = 0; z < type.size.height; z++) {
        const checkX = tileX + x;
        const checkZ = tileZ + z;
        const tile = this.tileGrid.tiles[checkX]?.[checkZ];
        if (!tile || !tile.walkable || tile.occupied) {
          return false;
        }
      }
    }

    // Check if player has resources (unless admin mode is enabled)
    if (!window.adminMode && this.player && this.player.inventory) {
      for (const [resource, amount] of Object.entries(type.cost)) {
        if (!this.player.inventory.hasItem(resource, amount)) {
          return false;
        }
      }
    }

    return true;
  }

  placeBuilding(tileX, tileZ, buildingType) {
    if (!this.canPlaceBuilding(tileX, tileZ, buildingType)) {
      return false;
    }

    const type = getBuildingType(buildingType);
    if (!type) return false;

    // Deduct resources (unless admin mode is enabled)
    if (!window.adminMode && this.player && this.player.inventory) {
      for (const [resource, amount] of Object.entries(type.cost)) {
        this.player.inventory.removeItem(resource, amount);
      }
    }

    // Create building
    const building = new Building(this.scene, this.tileGrid, tileX, tileZ, buildingType);
    
    // Customize based on type
    if (buildingType === 'storage') {
      building.inventory = new StorageInventory(16); // Storage can hold 16 items of one type
    }

    // Mark tiles as occupied
    for (let x = 0; x < type.size.width; x++) {
      for (let z = 0; z < type.size.height; z++) {
        const tile = this.tileGrid.tiles[tileX + x]?.[tileZ + z];
        if (tile) {
          tile.occupied = true;
        }
      }
    }

    this.buildings.push(building);
    return building;
  }

  enterPlacementMode(buildingType) {
    this.placementMode = true;
    this.selectedBuildingType = buildingType;
  }

  exitPlacementMode() {
    this.placementMode = false;
    this.selectedBuildingType = null;
    if (this.previewBuilding) {
      this.scene.remove(this.previewBuilding);
      this.previewBuilding = null;
    }
  }

  updatePreview(worldX, worldZ) {
    if (!this.placementMode || !this.selectedBuildingType) return;

    const tileX = Math.floor(worldX / this.tileGrid.tileSize + this.tileGrid.width / 2);
    const tileZ = Math.floor(worldZ / this.tileGrid.tileSize + this.tileGrid.height / 2);

    // Remove old preview
    if (this.previewBuilding) {
      this.scene.remove(this.previewBuilding);
    }

    // Create preview
    const type = getBuildingType(this.selectedBuildingType);
    if (type) {
      const canPlace = this.canPlaceBuilding(tileX, tileZ, this.selectedBuildingType);
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ 
        color: canPlace ? 0x00FF00 : 0xFF0000,
        opacity: 0.5,
        transparent: true
      });
      this.previewBuilding = new THREE.Mesh(geometry, material);
      const tile = this.tileGrid.tiles[tileX]?.[tileZ];
      if (tile) {
        this.previewBuilding.position.set(tile.worldX, 0.5, tile.worldZ);
      }
      this.scene.add(this.previewBuilding);
    }
  }

  getBuildings() {
    return this.buildings;
  }
}

