import * as THREE from 'three';
import { Inventory } from './Inventory.js';
import { Pathfinder } from './Pathfinder.js';
import { ProgramExecutor } from './programming/ProgramExecutor.js';

export class Villager {
  constructor(scene, tileGrid, tileX, tileZ) {
    this.scene = scene;
    this.tileGrid = tileGrid;
    this.tileX = tileX;
    this.tileZ = tileZ;
    this.mesh = null;
    this.inventory = new Inventory(10);
    this.pathfinder = new Pathfinder(tileGrid);
    this.path = [];
    this.speed = 1.5;
    this.isMoving = false;
    this.currentTask = null;
    this.program = null;
    this.programExecutor = new ProgramExecutor(this);
    this.currentTile = null;
    this.create();
  }

  create() {
    // Simple villager model
    const geometry = new THREE.CylinderGeometry(0.3, 0.3, 1.0, 8);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xFFD700, // Gold
      roughness: 0.7,
      metalness: 0.3
    });
    this.mesh = new THREE.Mesh(geometry, material);
    
    // Position at tile center
    const tile = this.tileGrid.getTile(this.tileX, this.tileZ);
    if (tile) {
      this.mesh.position.set(tile.worldX, 0.5, tile.worldZ);
      this.currentTile = tile;
    } else {
      this.mesh.position.set(0, 0.5, 0);
    }
    
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }

  // Move to tile coordinates (strict tile-based movement)
  moveTo(tileX, tileZ) {
    const targetTile = this.tileGrid.getTile(tileX, tileZ);
    if (!targetTile || !targetTile.walkable) {
      return false;
    }

    const startTileX = this.currentTile ? this.currentTile.tileX : this.tileX;
    const startTileZ = this.currentTile ? this.currentTile.tileZ : this.tileZ;
    
    const path = this.pathfinder.findPath(startTileX, startTileZ, tileX, tileZ);
    if (path.length > 0) {
      this.path = path;
      this.isMoving = true;
      return true;
    }
    return false;
  }

  // Legacy method for world coordinates - converts to tile coordinates
  moveToWorld(worldX, worldZ) {
    const { tileX, tileZ } = this.tileGrid.worldToTile(worldX, worldZ);
    return this.moveTo(tileX, tileZ);
  }

  update(deltaTime) {
    // Update movement - tile-to-tile with visual smoothing
    if (this.path.length > 0 && this.isMoving) {
      const targetTile = this.path[0];
      const targetX = targetTile.worldX;
      const targetZ = targetTile.worldZ;
      const dx = targetX - this.mesh.position.x;
      const dz = targetZ - this.mesh.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < 0.1) {
        // Reached waypoint - snap to tile center
        this.mesh.position.x = targetX;
        this.mesh.position.z = targetZ;
        this.currentTile = targetTile;
        this.path.shift();
        
        if (this.path.length === 0) {
          this.isMoving = false;
        }
      } else {
        // Smooth movement towards tile center
        const moveDistance = this.speed * deltaTime;
        if (moveDistance >= distance) {
          // Snap to tile center if close enough
          this.mesh.position.x = targetX;
          this.mesh.position.z = targetZ;
          this.currentTile = targetTile;
          this.path.shift();
          
          if (this.path.length === 0) {
            this.isMoving = false;
          }
        } else {
          // Move towards waypoint
          this.mesh.position.x += (dx / distance) * moveDistance;
          this.mesh.position.z += (dz / distance) * moveDistance;
        }
        
        // Rotate to face movement direction
        if (distance > 0.01) {
          const angle = Math.atan2(dx, dz);
          this.mesh.rotation.y = angle;
        }
      }
    }

    // Update program execution if exists
    if (this.programExecutor) {
      this.programExecutor.update(deltaTime);
    }
  }

  setProgram(program) {
    this.program = program;
    if (this.programExecutor) {
      this.programExecutor.setProgram(program);
    }
  }

  getPosition() {
    return {
      x: this.mesh.position.x,
      z: this.mesh.position.z
    };
  }

  // Get tile coordinates of current position
  getTilePosition() {
    if (this.currentTile) {
      return {
        tileX: this.currentTile.tileX,
        tileZ: this.currentTile.tileZ
      };
    }
    // Fallback: convert world position to tile coordinates
    const { tileX, tileZ } = this.tileGrid.worldToTile(this.mesh.position.x, this.mesh.position.z);
    return { tileX, tileZ };
  }

  getCurrentTile() {
    return this.currentTile;
  }
}
