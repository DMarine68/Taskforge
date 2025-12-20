import * as THREE from 'three';
import { ItemType } from '../ItemType.js';

/**
 * Wood item type (resource)
 */
export class Wood extends ItemType {
  constructor() {
    super('wood', 'Wood');
    this.color = 0x8B4513; // Brown
  }

  getHandModel(scale = 1.0) {
    const geometry = new THREE.BoxGeometry(0.3 * scale, 0.3 * scale, 0.5 * scale);
    const material = new THREE.MeshStandardMaterial({ 
      color: this.color,
      roughness: 0.7,
      metalness: 0.2
    });
    return new THREE.Mesh(geometry, material);
  }

  getWorldModel() {
    const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.5);
    const material = new THREE.MeshStandardMaterial({ 
      color: this.color,
      roughness: 0.7,
      metalness: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
}

