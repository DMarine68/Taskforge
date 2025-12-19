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
    this.mesh.position.set(
      this.tileGrid.tiles[this.tileX][this.tileZ].worldX,
      0.5,
      this.tileGrid.tiles[this.tileX][this.tileZ].worldZ
    );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }

  moveTo(worldX, worldZ) {
    const path = this.pathfinder.findPath(
      this.mesh.position.x,
      this.mesh.position.z,
      worldX,
      worldZ
    );
    if (path.length > 0) {
      this.path = path;
      this.isMoving = true;
      return true;
    }
    return false;
  }

  update(deltaTime) {
    // Update movement
    if (this.path.length > 0 && this.isMoving) {
      const targetTile = this.path[0];
      const targetX = targetTile.worldX;
      const targetZ = targetTile.worldZ;
      const dx = targetX - this.mesh.position.x;
      const dz = targetZ - this.mesh.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < 0.1) {
        this.path.shift();
        if (this.path.length === 0) {
          this.isMoving = false;
        }
      } else {
        const moveDistance = this.speed * deltaTime;
        this.mesh.position.x += (dx / distance) * moveDistance;
        this.mesh.position.z += (dz / distance) * moveDistance;
        const angle = Math.atan2(dx, dz);
        this.mesh.rotation.y = angle;
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
}

