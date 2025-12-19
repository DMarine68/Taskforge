import * as THREE from 'three';
import { Resource } from './Resource.js';

export class InteractionManager {
  constructor(camera, renderer, scene, player, worldObjects, buildingManager, sceneManager, tileHighlighter) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
    this.player = player;
    this.worldObjects = worldObjects;
    this.buildingManager = buildingManager;
    this.sceneManager = sceneManager;
    this.tileHighlighter = tileHighlighter;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredObject = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // LMB - Only for clicking (no drag)
    this.renderer.domElement.addEventListener('click', (e) => {
      if (e.button === 0) { // Left mouse button only
        this.onClick(e);
      }
    }, false);
    
    // RMB - Drop items
    this.renderer.domElement.addEventListener('contextmenu', (e) => {
      e.preventDefault(); // Prevent context menu
      this.onRightClick(e);
    }, false);
    
    this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'b' || e.key === 'B') {
        // Toggle building placement UI
        if (this.sceneManager && this.sceneManager.buildingPlacementUI) {
          if (this.sceneManager.buildingPlacementUI.element.style.display === 'none' || 
              !this.sceneManager.buildingPlacementUI.element.parentNode) {
            this.sceneManager.buildingPlacementUI.show();
          } else {
            this.sceneManager.buildingPlacementUI.hide();
            if (this.buildingManager) {
              this.buildingManager.exitPlacementMode();
            }
          }
        }
      }
      if (e.key === 'c' || e.key === 'C') {
        // Toggle blueprint/crafting UI
        if (this.sceneManager && this.sceneManager.blueprintUI) {
          if (this.sceneManager.blueprintUI.element.style.display === 'none' || 
              !this.sceneManager.blueprintUI.element.parentNode) {
            this.sceneManager.blueprintUI.show();
          } else {
            this.sceneManager.blueprintUI.hide();
          }
        }
      }
      if (e.key === 'Escape' && this.buildingManager && this.buildingManager.placementMode) {
        this.buildingManager.exitPlacementMode();
        if (this.sceneManager && this.sceneManager.buildingPlacementUI) {
          this.sceneManager.buildingPlacementUI.hide();
        }
      }
    });
  }

  onMouseMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update tile highlight - use accurate world position
    if (this.tileHighlighter && this.sceneManager && this.sceneManager.tileGrid) {
      const worldPos = this.getMouseWorldPosition();
      this.tileHighlighter.update(worldPos.x, worldPos.z);
    }

    // Update building preview if in placement mode
    if (this.buildingManager && this.buildingManager.placementMode) {
      const worldPos = this.getMouseWorldPosition();
      this.buildingManager.updatePreview(worldPos.x, worldPos.z);
    }

    // Check for hover on objects (including resources)
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Collect all meshes including groups
    const allMeshes = [];
    this.worldObjects.forEach(obj => {
      if (obj.mesh) {
        if (obj.mesh instanceof THREE.Group) {
          obj.mesh.children.forEach(child => allMeshes.push(child));
        } else {
          allMeshes.push(obj.mesh);
        }
      }
    });

    const intersects = this.raycaster.intersectObjects(allMeshes);

    if (intersects.length > 0) {
      // Find which object was hovered
      let hoveredObject = null;
      for (const obj of this.worldObjects) {
        if (obj.mesh instanceof THREE.Group) {
          if (obj.mesh.children.includes(intersects[0].object)) {
            hoveredObject = obj;
            break;
          }
        } else if (obj.mesh === intersects[0].object) {
          hoveredObject = obj;
          break;
        }
      }

      if (hoveredObject && hoveredObject !== this.hoveredObject) {
        // Remove highlight from previous object
        if (this.hoveredObject && this.hoveredObject.mesh) {
          this.hoveredObject.mesh.scale.set(1, 1, 1);
        }
        
        this.hoveredObject = hoveredObject;
        
        // Add visual feedback for resources
        if (hoveredObject.mesh) {
          hoveredObject.mesh.scale.set(1.1, 1.1, 1.1);
        }
      }
    } else {
      // Remove highlight from previous object
      if (this.hoveredObject && this.hoveredObject.mesh) {
        this.hoveredObject.mesh.scale.set(1, 1, 1);
      }
      this.hoveredObject = null;
    }
  }

  getMouseWorldPosition() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectionPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(plane, intersectionPoint);
    return intersectionPoint;
  }

  async onClick(event) {
    // Check if in building placement mode
    if (this.buildingManager && this.buildingManager.placementMode) {
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectionPoint = new THREE.Vector3();
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.raycaster.ray.intersectPlane(plane, intersectionPoint);

      const tileX = Math.floor(intersectionPoint.x / this.sceneManager.tileGrid.tileSize + this.sceneManager.tileGrid.width / 2);
      const tileZ = Math.floor(intersectionPoint.z / this.sceneManager.tileGrid.tileSize + this.sceneManager.tileGrid.height / 2);

      const building = this.buildingManager.placeBuilding(tileX, tileZ, this.buildingManager.selectedBuildingType);
      if (building) {
        this.worldObjects.push(building);
        this.buildingManager.exitPlacementMode();
        this.sceneManager.buildingPlacementUI.update();
      }
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for building clicks first
    if (this.buildingManager) {
      const buildingMeshes = this.buildingManager.buildings.map(b => b.mesh).filter(m => m !== null);
      const buildingIntersects = this.raycaster.intersectObjects(buildingMeshes);
      
      if (buildingIntersects.length > 0) {
        const clickedBuilding = this.buildingManager.buildings.find(b => {
          // Check if the clicked mesh belongs to this building (handle groups)
          if (b.mesh instanceof THREE.Group) {
            return b.mesh.children.includes(buildingIntersects[0].object) || b.mesh === buildingIntersects[0].object;
          }
          return b.mesh === buildingIntersects[0].object;
        });
        
        if (clickedBuilding) {
          // Handle storage container withdraw (left click)
          if (clickedBuilding.buildingType === 'storage' && this.player) {
            const playerPos = this.player.getPosition();
            if (clickedBuilding.canInteract && clickedBuilding.canInteract(playerPos)) {
              clickedBuilding.interact(this.player);
              // Update hand item display
              if (this.player.updateHandItem) {
                this.player.updateHandItem();
              }
              return;
            } else {
              // Move player to storage container
              this.player.moveTo(clickedBuilding.worldX, clickedBuilding.worldZ);
              return;
            }
          }
          
          // For other buildings, show building UI
          if (this.sceneManager) {
            if (this.sceneManager.currentBuildingUI) {
              this.sceneManager.currentBuildingUI.destroy();
            }
            const { BuildingUI } = await import('../ui/BuildingUI.js');
            this.sceneManager.currentBuildingUI = new BuildingUI(
              this.sceneManager.container,
              clickedBuilding
            );
            this.sceneManager.currentBuildingUI.show();
          }
        }
        return;
      }
    }
    
    // Check for object clicks (including resources which might be in a group)
    const allMeshes = [];
    this.worldObjects.forEach(obj => {
      if (obj.mesh) {
        if (obj.mesh instanceof THREE.Group) {
          obj.mesh.children.forEach(child => allMeshes.push(child));
        } else {
          allMeshes.push(obj.mesh);
        }
      }
    });

    const intersects = this.raycaster.intersectObjects(allMeshes);

    if (intersects.length > 0) {
      // Find which object was clicked
      let clickedObject = null;
      for (const obj of this.worldObjects) {
        if (obj.mesh instanceof THREE.Group) {
          if (obj.mesh.children.includes(intersects[0].object)) {
            clickedObject = obj;
            break;
          }
        } else if (obj.mesh === intersects[0].object) {
          clickedObject = obj;
          break;
        }
      }

      // Only handle object clicks if we found a valid worldObject
      if (clickedObject && this.player) {
        const playerPos = this.player.getPosition();
        if (clickedObject.canInteract && clickedObject.canInteract(playerPos)) {
          // For resources, pick up 1 item at a time
          if (clickedObject instanceof Resource) {
            clickedObject.interact(this.player);
            // Trigger pickup animation
            if (this.player.triggerPickupAnimation) {
              this.player.triggerPickupAnimation();
            }
            // Update hand item immediately
            if (this.player.updateHandItem) {
              this.player.updateHandItem();
            }
            // Remove object only if stack is empty
            if (clickedObject.shouldRemove && clickedObject.shouldRemove()) {
              this.removeObject(clickedObject);
              clickedObject.remove();
            }
          } else {
            // For other objects, use normal interaction
            clickedObject.interact(this.player);
            if (clickedObject.shouldRemove && clickedObject.shouldRemove()) {
              this.removeObject(clickedObject);
              clickedObject.remove();
            }
          }
        } else {
          // Move player to object if not in range
          this.player.moveTo(clickedObject.worldX, clickedObject.worldZ);
        }
        return; // Only return if we actually handled an object click
      }
      // If intersection didn't match a worldObject, fall through to ground movement
    }

    // Otherwise, check if there's a resource on the clicked tile and move to it
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectionPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(plane, intersectionPoint);

    if (this.player && this.sceneManager && this.sceneManager.tileGrid) {
      // Check if there's a resource on this tile
      const tile = this.sceneManager.tileGrid.getTileAtWorldPosition(intersectionPoint.x, intersectionPoint.z);
      if (tile) {
        // Find resources on this tile
        const resourceOnTile = this.worldObjects.find(obj => {
          if (obj instanceof Resource || (obj.constructor && obj.constructor.name === 'Resource')) {
            const objTile = this.sceneManager.tileGrid.getTileAtWorldPosition(obj.worldX, obj.worldZ);
            return objTile && objTile.x === tile.x && objTile.z === tile.z;
          }
          return false;
        });

        if (resourceOnTile) {
          // Move to the resource's position
          this.player.moveTo(resourceOnTile.worldX, resourceOnTile.worldZ);
        } else {
          // Just move to the clicked position
          this.player.moveTo(intersectionPoint.x, intersectionPoint.z);
        }
      } else {
        // Move to clicked position
        this.player.moveTo(intersectionPoint.x, intersectionPoint.z);
      }
    }
  }

  addObject(object) {
    this.worldObjects.push(object);
  }

  removeObject(object) {
    const index = this.worldObjects.indexOf(object);
    if (index > -1) {
      this.worldObjects.splice(index, 1);
    }
  }

  onRightClick(event) {
    // Right mouse button - Deposit items to storage or drop on ground
    if (!this.player || !this.player.inventory) return;

    const items = this.player.inventory.getAllItems();
    if (items.length === 0) return;

    // Get mouse position
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera);

    // First check if clicking on a storage container
    if (this.buildingManager) {
      const buildingMeshes = this.buildingManager.buildings.map(b => b.mesh).filter(m => m !== null);
      const buildingIntersects = this.raycaster.intersectObjects(buildingMeshes);
      
      if (buildingIntersects.length > 0) {
        const clickedBuilding = this.buildingManager.buildings.find(b => {
          // Check if the clicked mesh belongs to this building (handle groups)
          if (b.mesh instanceof THREE.Group) {
            return b.mesh.children.includes(buildingIntersects[0].object) || b.mesh === buildingIntersects[0].object;
          }
          return b.mesh === buildingIntersects[0].object;
        });
        
        // Handle storage container deposit (right click)
        if (clickedBuilding && clickedBuilding.buildingType === 'storage' && this.player) {
          const playerPos = this.player.getPosition();
          if (clickedBuilding.canInteract && clickedBuilding.canInteract(playerPos)) {
            // Try to deposit the first item in inventory
            const itemType = items[0].type;
            if (clickedBuilding.depositItem(itemType, 1)) {
              this.player.inventory.removeItem(itemType, 1);
              // Update hand item display
              if (this.player.updateHandItem) {
                this.player.updateHandItem();
              }
              return;
            }
          } else {
            // Move player to storage container
            this.player.moveTo(clickedBuilding.worldX, clickedBuilding.worldZ);
            return;
          }
        }
      }
    }

    // If not clicking on storage, drop item on ground
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectionPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(plane, intersectionPoint);

    // Get the tile at the drop location
    const tile = this.sceneManager?.tileGrid?.getTileAtWorldPosition(intersectionPoint.x, intersectionPoint.z);
    
    if (tile) {
      // Check if player is already on this tile
      const playerTile = this.player.getCurrentTile();
      const playerPos = this.player.getPosition();
      const dx = intersectionPoint.x - playerPos.x;
      const dz = intersectionPoint.z - playerPos.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < 0.5) {
        // Player is close enough, drop immediately
        this.dropItemAt(intersectionPoint.x, intersectionPoint.z, items[0].type);
      } else {
        // Player needs to travel to the tile first
        // Store drop action to execute when player arrives
        this.player.pendingDropAction = {
          x: intersectionPoint.x,
          z: intersectionPoint.z,
          itemType: items[0].type
        };
        this.player.moveTo(intersectionPoint.x, intersectionPoint.z);
      }
    }
  }
  
  dropItemAt(worldX, worldZ, itemType) {
    if (!this.player || !this.player.inventory) return;
    
    // Try to remove 1 item from inventory
    if (!this.player.inventory.removeItem(itemType, 1)) {
      return; // Couldn't remove item
    }
    
    // Update hand item immediately (before animation) to reflect inventory change
    if (this.player.updateHandItem) {
      this.player.updateHandItem();
    }
    
    // Trigger drop animation
    if (this.player.triggerDropAnimation) {
      this.player.triggerDropAnimation();
    }
    
    // Check if there's already a resource of this type on this tile
    const tile = this.sceneManager?.tileGrid?.getTileAtWorldPosition(worldX, worldZ);
    if (tile) {
      const existingResource = this.worldObjects.find(obj => {
        if (obj instanceof Resource && obj.type === itemType) {
          const objTile = this.sceneManager.tileGrid.getTileAtWorldPosition(obj.worldX, obj.worldZ);
          return objTile && objTile.x === tile.x && objTile.z === tile.z;
        }
        return false;
      });
      
      if (existingResource) {
        // Add to existing stack
        existingResource.addToStack(1);
      } else {
        // Create new resource
        if (this.sceneManager) {
          this.sceneManager.spawnResource(worldX, worldZ, itemType);
        }
      }
    }
  }
}

