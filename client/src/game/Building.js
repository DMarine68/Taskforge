import * as THREE from 'three';
import { WorldObject } from './WorldObject.js';

export class Building extends WorldObject {
  constructor(scene, tileGrid, tileX, tileZ, buildingType) {
    super(scene, tileGrid, tileX, tileZ);
    this.buildingType = buildingType;
    this.isComplete = true;
    this.inventory = null; // For storage buildings
    this.itemIconMesh = null; // For storage item icon display
    this.flashAnimation = null; // For red flashing when full
    this.create();
  }

  create() {
    if (this.buildingType === 'storage') {
      this.createStorageContainer();
    } else {
      // Default building creation
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x8B7355, // Brown
        roughness: 0.8,
        metalness: 0.2
      });
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.set(this.worldX, 0.5, this.worldZ);
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
      this.scene.add(this.mesh);
    }
  }

  createStorageContainer() {
    const containerGroup = new THREE.Group();
    
    // Create wooden crate base (warm light brown/yellowish)
    const crateColor = 0xD2B48C; // Warm light brown/beige
    
    // Main crate body
    const bodyGeometry = new THREE.BoxGeometry(0.9, 0.6, 0.9);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: crateColor,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0.3, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    containerGroup.add(body);
    
    // Wooden frame/beams (darker brown)
    const frameColor = 0x8B7355; // Darker brown
    const frameMaterial = new THREE.MeshStandardMaterial({ 
      color: frameColor,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true
    });
    
    // Vertical corner beams
    const cornerBeamSize = 0.05;
    const cornerBeamHeight = 0.6;
    const cornerPositions = [
      [-0.425, 0.3, -0.425],
      [0.425, 0.3, -0.425],
      [-0.425, 0.3, 0.425],
      [0.425, 0.3, 0.425]
    ];
    
    cornerPositions.forEach(pos => {
      const cornerGeometry = new THREE.BoxGeometry(cornerBeamSize, cornerBeamHeight, cornerBeamSize);
      const corner = new THREE.Mesh(cornerGeometry, frameMaterial);
      corner.position.set(pos[0], pos[1], pos[2]);
      corner.castShadow = true;
      corner.receiveShadow = true;
      containerGroup.add(corner);
    });
    
    // Top panel (white/light blue square for item icon)
    const panelGeometry = new THREE.PlaneGeometry(0.3, 0.3);
    const panelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xF0F0F0, // Light gray/white
      roughness: 0.5,
      metalness: 0.0,
      side: THREE.DoubleSide
    });
    const topPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    topPanel.rotation.x = -Math.PI / 2; // Face upward
    topPanel.position.set(0, 0.61, 0); // Slightly above the crate
    topPanel.receiveShadow = true;
    containerGroup.add(topPanel);
    this.topPanel = topPanel; // Store reference for flashing
    
    this.mesh = containerGroup;
    this.mesh.position.set(this.worldX, 0, this.worldZ);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
    
    // Question mark placeholder (will be replaced by item icon)
    // Create after mesh is set
    this.createQuestionMark();
  }

  createQuestionMark() {
    // Remove existing icon if any
    if (this.itemIconMesh) {
      this.mesh.remove(this.itemIconMesh);
      if (this.itemIconMesh instanceof THREE.Group) {
        this.itemIconMesh.children.forEach(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      } else {
        if (this.itemIconMesh.geometry) this.itemIconMesh.geometry.dispose();
        if (this.itemIconMesh.material) this.itemIconMesh.material.dispose();
      }
    }
    
    // Create a simple question mark using geometry
    const questionGroup = new THREE.Group();
    
    // Question mark stem (vertical line)
    const stemGeometry = new THREE.BoxGeometry(0.05, 0.15, 0.01);
    const questionMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x000000,
      roughness: 0.5
    });
    const stem = new THREE.Mesh(stemGeometry, questionMaterial);
    stem.position.set(0, 0.04, 0.01);
    questionGroup.add(stem);
    
    // Question mark curve (top part)
    const curveGeometry = new THREE.BoxGeometry(0.12, 0.05, 0.01);
    const curve = new THREE.Mesh(curveGeometry, questionMaterial);
    curve.position.set(0.03, 0.11, 0.01);
    curve.rotation.z = Math.PI / 4;
    questionGroup.add(curve);
    
    // Question mark dot (bottom)
    const dotGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.01);
    const dot = new THREE.Mesh(dotGeometry, questionMaterial);
    dot.position.set(0, -0.03, 0.01);
    questionGroup.add(dot);
    
    // Position question mark on top panel
    questionGroup.position.set(0, 0.61, 0);
    
    this.itemIconMesh = questionGroup;
    this.mesh.add(questionGroup);
  }

  createItemIcon(itemType) {
    // Stop flashing if active (will be restarted if needed)
    this.stopFlashing();
    
    // Remove existing icon
    if (this.itemIconMesh) {
      this.mesh.remove(this.itemIconMesh);
      if (this.itemIconMesh instanceof THREE.Group) {
        this.itemIconMesh.children.forEach(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      } else {
        if (this.itemIconMesh.geometry) this.itemIconMesh.geometry.dispose();
        if (this.itemIconMesh.material) this.itemIconMesh.material.dispose();
      }
    }
    
    // Create item icon model (smaller scale for display on crate)
    const iconGroup = new THREE.Group();
    const scale = 0.15; // Small scale for icon
    
    switch (itemType) {
      case 'wood':
        const woodGeometry = new THREE.BoxGeometry(0.3 * scale, 0.3 * scale, 0.5 * scale);
        const woodMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x8B4513,
          roughness: 0.7,
          metalness: 0.2
        });
        const woodIcon = new THREE.Mesh(woodGeometry, woodMaterial);
        iconGroup.add(woodIcon);
        break;
        
      case 'stone':
        const stoneGeometry = new THREE.BoxGeometry(0.4 * scale, 0.3 * scale, 0.4 * scale);
        const stoneMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x808080,
          roughness: 0.7,
          metalness: 0.2
        });
        const stoneIcon = new THREE.Mesh(stoneGeometry, stoneMaterial);
        iconGroup.add(stoneIcon);
        break;
        
      case 'stick':
        const stickBodyGeometry = new THREE.CylinderGeometry(0.05 * scale, 0.05 * scale, 0.6 * scale, 6);
        const stickMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xD2B48C,
          roughness: 0.8,
          metalness: 0.1,
          flatShading: true
        });
        const stickBody = new THREE.Mesh(stickBodyGeometry, stickMaterial);
        stickBody.rotation.z = Math.PI / 2;
        iconGroup.add(stickBody);
        
        const branchGeometry = new THREE.CylinderGeometry(0.03 * scale, 0.03 * scale, 0.2 * scale, 6);
        const branch = new THREE.Mesh(branchGeometry, stickMaterial);
        branch.rotation.z = Math.PI / 4;
        branch.position.set(-0.15 * scale, 0.08 * scale, 0);
        iconGroup.add(branch);
        break;
        
      case 'axe':
        const handleGeometry = new THREE.BoxGeometry(0.08 * scale, 0.6 * scale, 0.08 * scale);
        const handleMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xD2B48C,
          roughness: 0.8,
          metalness: 0.1,
          flatShading: true
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(0, 0.3 * scale, 0);
        handle.rotation.z = Math.PI / 12;
        iconGroup.add(handle);
        
        const headMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x808080,
          roughness: 0.4,
          metalness: 0.6,
          flatShading: true
        });
        
        const bladeGeometry = new THREE.BoxGeometry(0.25 * scale, 0.15 * scale, 0.08 * scale);
        const blade = new THREE.Mesh(bladeGeometry, headMaterial);
        blade.position.set(0.1 * scale, 0.45 * scale, 0);
        iconGroup.add(blade);
        
        const pollGeometry = new THREE.BoxGeometry(0.12 * scale, 0.12 * scale, 0.12 * scale);
        const poll = new THREE.Mesh(pollGeometry, headMaterial);
        poll.position.set(-0.05 * scale, 0.45 * scale, 0);
        iconGroup.add(poll);
        
        const eyeGeometry = new THREE.BoxGeometry(0.1 * scale, 0.15 * scale, 0.1 * scale);
        const eye = new THREE.Mesh(eyeGeometry, headMaterial);
        eye.position.set(0, 0.45 * scale, 0);
        iconGroup.add(eye);
        
        iconGroup.rotation.x = Math.PI / 6;
        break;
        
      default:
        const defaultGeometry = new THREE.BoxGeometry(0.3 * scale, 0.3 * scale, 0.3 * scale);
        const defaultMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xFFFFFF,
          roughness: 0.7,
          metalness: 0.2
        });
        const defaultIcon = new THREE.Mesh(defaultGeometry, defaultMaterial);
        iconGroup.add(defaultIcon);
    }
    
    // Position icon on top panel
    iconGroup.position.set(0, 0.61, 0.01);
    iconGroup.rotation.x = -Math.PI / 2; // Lay flat on top panel
    iconGroup.rotation.y = Math.PI / 4; // Slight rotation for better view
    
    this.itemIconMesh = iconGroup;
    this.mesh.add(iconGroup);
  }

  updateItemIcon() {
    if (this.buildingType !== 'storage' || !this.inventory) return;
    
    const storedItemType = this.inventory.getStoredItemType();
    if (storedItemType) {
      this.createItemIcon(storedItemType);
    } else {
      // Show question mark if empty
      this.createQuestionMark();
    }
    
    // Update flashing animation
    this.updateFlashing();
  }

  updateFlashing() {
    if (this.buildingType !== 'storage' || !this.inventory) return;
    
    const isFull = this.inventory.isFull();
    
    if (isFull && !this.flashAnimation) {
      // Start flashing animation
      this.startFlashing();
    } else if (!isFull && this.flashAnimation) {
      // Stop flashing animation
      this.stopFlashing();
    }
  }

  startFlashing() {
    if (this.flashAnimation) return; // Already flashing
    
    // Store original colors if not already stored
    if (!this.originalColors) {
      this.originalColors = new Map();
      if (this.itemIconMesh) {
        if (this.itemIconMesh instanceof THREE.Group) {
          this.itemIconMesh.children.forEach((child, index) => {
            if (child.material) {
              this.originalColors.set(index, {
                color: child.material.color.getHex(),
                emissive: child.material.emissive.getHex()
              });
            }
          });
        } else if (this.itemIconMesh.material) {
          this.originalColors.set(0, {
            color: this.itemIconMesh.material.color.getHex(),
            emissive: this.itemIconMesh.material.emissive.getHex()
          });
        }
      }
    }
    
    let flashState = false;
    this.flashAnimation = setInterval(() => {
      flashState = !flashState;
      
      if (this.itemIconMesh) {
        // Flash the item icon red using emissive
        if (this.itemIconMesh instanceof THREE.Group) {
          this.itemIconMesh.children.forEach((child, index) => {
            if (child.material) {
              if (flashState) {
                // Flash red - use strong emissive red
                child.material.emissive.setHex(0xFF0000);
                child.material.emissiveIntensity = 1.0;
              } else {
                // Restore original
                const original = this.originalColors.get(index);
                if (original) {
                  child.material.emissive.setHex(original.emissive);
                  child.material.emissiveIntensity = 0.0;
                }
              }
            }
          });
        } else if (this.itemIconMesh.material) {
          if (flashState) {
            this.itemIconMesh.material.emissive.setHex(0xFF0000);
            this.itemIconMesh.material.emissiveIntensity = 1.0;
          } else {
            const original = this.originalColors.get(0);
            if (original) {
              this.itemIconMesh.material.emissive.setHex(original.emissive);
              this.itemIconMesh.material.emissiveIntensity = 0.0;
            }
          }
        }
      }
    }, 500); // Flash every 500ms
  }

  stopFlashing() {
    if (this.flashAnimation) {
      clearInterval(this.flashAnimation);
      this.flashAnimation = null;
      
      // Reset item icon to original colors
      if (this.itemIconMesh && this.originalColors) {
        if (this.itemIconMesh instanceof THREE.Group) {
          this.itemIconMesh.children.forEach((child, index) => {
            if (child.material) {
              const original = this.originalColors.get(index);
              if (original) {
                child.material.emissive.setHex(original.emissive);
                child.material.emissiveIntensity = 0.0;
              }
            }
          });
        } else if (this.itemIconMesh.material) {
          const original = this.originalColors.get(0);
          if (original) {
            this.itemIconMesh.material.emissive.setHex(original.emissive);
            this.itemIconMesh.material.emissiveIntensity = 0.0;
          }
        }
      }
      this.originalColors = null; // Clear stored colors
    }
  }

  interact(player) {
    // For storage containers, left click withdraws items
    if (this.buildingType === 'storage' && this.inventory && player && player.inventory) {
      const storedItemType = this.inventory.getStoredItemType();
      if (storedItemType) {
        // Withdraw 1 item
        if (this.inventory.removeItem(storedItemType, 1)) {
          player.inventory.addItem(storedItemType, 1);
          this.updateItemIcon();
          return true;
        }
      }
    }
    return false;
  }

  depositItem(itemType, count = 1) {
    // Right click deposits items
    if (this.buildingType === 'storage' && this.inventory) {
      if (this.inventory.addItem(itemType, count)) {
        this.updateItemIcon();
        return true;
      }
    }
    return false;
  }

  getType() {
    return this.buildingType;
  }

  remove() {
    // Clean up flashing animation
    this.stopFlashing();
    super.remove();
  }
}


