import * as THREE from 'three';

/**
 * Base class for all item types in the game.
 * Each item type (wood, stone, stick, axe, etc.) should extend this class
 * and implement methods for creating different visual representations.
 */
export class ItemType {
  // Positioning constants (in world units, where Y=0 is ground level)
  static DEFAULT_WORLD_Y_POSITION = 0.15; // Default height above ground for most items
  static STICK_WORLD_Y_POSITION = 0.0875;  // Lower height for sticks to sit on ground
  
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  /**
   * Creates a model for when the item is held in the player's hand.
   * @param {number} scale - Scale factor for the model (default: 1.0)
   * @returns {THREE.Object3D} The 3D model for the hand
   */
  getHandModel(scale = 1.0) {
    // Override in subclasses
    throw new Error(`getHandModel() not implemented for ${this.id}`);
  }

  /**
   * Creates a model for when the item is placed in the world.
   * @returns {THREE.Object3D} The 3D model for the world
   */
  getWorldModel() {
    // Override in subclasses
    throw new Error(`getWorldModel() not implemented for ${this.id}`);
  }

  /**
   * Creates a model for UI icons (e.g., in inventory, building UI).
   * @param {number} scale - Scale factor for the model (default: 0.5)
   * @returns {THREE.Object3D} The 3D model for the icon
   */
  getIconModel(scale = 0.5) {
    // Default to hand model with different scale
    return this.getHandModel(scale);
  }

  /**
   * Gets the display name of the item.
   * @returns {string} The display name
   */
  getDisplayName() {
    return this.name;
  }

  /**
   * Gets the item type ID.
   * @returns {string} The item type ID
   */
  getId() {
    return this.id;
  }

  /**
   * Positions and configures a world model mesh in the scene.
   * @param {THREE.Object3D} mesh - The mesh to position
   * @param {number} worldX - World X coordinate
   * @param {number} worldZ - World Z coordinate
   * @param {number} yPosition - Y position (default: DEFAULT_WORLD_Y_POSITION)
   * @param {number} xRotation - X rotation in radians (default: 0)
   */
  positionWorldModel(mesh, worldX, worldZ, yPosition = ItemType.DEFAULT_WORLD_Y_POSITION, xRotation = 0) {
    mesh.position.set(worldX, yPosition, worldZ);
    mesh.rotation.y = Math.random() * Math.PI * 2;
    if (xRotation !== 0) {
      mesh.rotation.x = xRotation;
    }
  }
}

