import { Resource } from '../game/Resource.js';

export class AdminMenu {
  constructor(container) {
    this.container = container;
    this.element = null;
    this.adminMode = false;
    this.create();
  }

  create() {
    this.element = document.createElement('div');
    this.element.id = 'admin-menu';
    this.element.innerHTML = `
      <div class="admin-content">
        <h2 class="admin-title">Admin Menu</h2>
        <div class="admin-options">
          <div class="admin-option">
            <label class="admin-label">
              <input type="checkbox" id="admin-bypass-toggle" ${this.adminMode ? 'checked' : ''}>
              <span class="checkbox-label">Bypass Build/Craft Requirements</span>
            </label>
          </div>
        </div>
        <div class="admin-buttons">
          <button class="admin-button" id="move-to-nearest-resource-button">Move to Nearest Resource</button>
          <button class="admin-button" id="move-to-nearest-stick-button">Move to Nearest Stick</button>
          <button class="admin-button" id="close-admin-button">Close</button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #admin-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 5000;
        backdrop-filter: blur(5px);
      }

      #admin-menu.visible {
        display: flex;
      }

      .admin-content {
        text-align: center;
        padding: 40px;
        background: rgba(26, 26, 26, 0.95);
        border: 3px solid #FF69B4;
        border-radius: 12px;
        box-shadow: 0 0 30px rgba(255, 105, 180, 0.5);
        min-width: 500px;
      }

      .admin-title {
        color: #FF69B4;
        font-size: 36px;
        margin: 0 0 30px 0;
        text-shadow: 0 0 20px rgba(255, 105, 180, 0.6);
        font-family: 'Arial', sans-serif;
      }

      .admin-options {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 30px;
        align-items: flex-start;
      }

      .admin-option {
        width: 100%;
      }

      .admin-label {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #ffffff;
        font-size: 18px;
        cursor: pointer;
        user-select: none;
      }

      .admin-label input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: #FF69B4;
      }

      .checkbox-label {
        color: #ffffff;
        font-family: 'Arial', sans-serif;
      }

      .admin-buttons {
        display: flex;
        gap: 20px;
        justify-content: center;
      }

      .admin-button {
        background: rgba(26, 26, 26, 0.8);
        border: 2px solid #FF69B4;
        border-radius: 8px;
        color: #FF69B4;
        font-size: 18px;
        padding: 12px 30px;
        min-width: 150px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Arial', sans-serif;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }

      .admin-button:hover {
        background: rgba(255, 105, 180, 0.2);
        box-shadow: 0 0 20px rgba(255, 105, 180, 0.5);
        transform: translateY(-2px);
      }

      .admin-button:active {
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    this.setupEventListeners();
    this.setupKeyboardListener();
  }

  setupKeyboardListener() {
    document.addEventListener('keydown', (e) => {
      // Check for backtick/tilde key (`)
      if (e.key === '`' || e.key === '~') {
        if (this.element.classList.contains('visible')) {
          this.hide();
        } else {
          this.show();
        }
      }
      if (e.key === 'Escape' && this.element.classList.contains('visible')) {
        this.hide();
      }
    });
  }

  setupEventListeners() {
    const bypassToggle = this.element.querySelector('#admin-bypass-toggle');
    const closeButton = this.element.querySelector('#close-admin-button');
    const moveToNearestResourceButton = this.element.querySelector('#move-to-nearest-resource-button');
    const moveToNearestStickButton = this.element.querySelector('#move-to-nearest-stick-button');

    bypassToggle.addEventListener('change', (e) => {
      this.adminMode = e.target.checked;
      // Store in window for global access
      window.adminMode = this.adminMode;
    });

    closeButton.addEventListener('click', () => {
      this.hide();
    });

    moveToNearestResourceButton.addEventListener('click', () => {
      this.moveToNearestResource();
    });

    moveToNearestStickButton.addEventListener('click', () => {
      this.moveToNearestStick();
    });
  }

  show() {
    if (!this.element.parentNode) {
      this.container.appendChild(this.element);
    }
    this.element.classList.add('visible');
  }

  hide() {
    this.element.classList.remove('visible');
  }

  isAdminMode() {
    return this.adminMode;
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  // Find nearest resource of any type and move player to it
  moveToNearestResource() {
    const gameInstance = window.gameInstance;
    if (!gameInstance || !gameInstance.sceneManager || !gameInstance.sceneManager.player) {
      console.warn('Game instance or player not available');
      return;
    }

    const sceneManager = gameInstance.sceneManager;
    const player = sceneManager.player;
    const worldObjects = sceneManager.worldObjects;

    // Find all resources
    const resources = worldObjects.filter(obj => obj instanceof Resource);

    if (resources.length === 0) {
      console.log('No resources found in the world');
      return;
    }

    // Get player's current tile position
    const playerTilePos = player.getTilePosition();
    if (!playerTilePos) {
      console.warn('Could not get player tile position');
      return;
    }

    // Find nearest resource
    let nearestResource = null;
    let nearestDistance = Infinity;

    for (const resource of resources) {
      const resourceTilePos = resource.getTilePosition();
      const dx = resourceTilePos.tileX - playerTilePos.tileX;
      const dz = resourceTilePos.tileZ - playerTilePos.tileZ;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestResource = resource;
      }
    }

    if (nearestResource) {
      const targetTilePos = nearestResource.getTilePosition();
      player.moveTo(targetTilePos.tileX, targetTilePos.tileZ);
      this.hide(); // Close admin menu after moving
    }
  }

  // Find nearest stick and move player to it
  moveToNearestStick() {
    const gameInstance = window.gameInstance;
    if (!gameInstance || !gameInstance.sceneManager || !gameInstance.sceneManager.player) {
      console.warn('Game instance or player not available');
      return;
    }

    const sceneManager = gameInstance.sceneManager;
    const player = sceneManager.player;
    const worldObjects = sceneManager.worldObjects;

    // Find all stick resources
    const sticks = worldObjects.filter(obj => 
      obj instanceof Resource && obj.type === 'stick'
    );

    if (sticks.length === 0) {
      console.log('No sticks found in the world');
      return;
    }

    // Get player's current tile position
    const playerTilePos = player.getTilePosition();
    if (!playerTilePos) {
      console.warn('Could not get player tile position');
      return;
    }

    // Find nearest stick
    let nearestStick = null;
    let nearestDistance = Infinity;

    for (const stick of sticks) {
      const stickTilePos = stick.getTilePosition();
      const dx = stickTilePos.tileX - playerTilePos.tileX;
      const dz = stickTilePos.tileZ - playerTilePos.tileZ;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestStick = stick;
      }
    }

    if (nearestStick) {
      const targetTilePos = nearestStick.getTilePosition();
      player.moveTo(targetTilePos.tileX, targetTilePos.tileZ);
      this.hide(); // Close admin menu after moving
    }
  }
}


