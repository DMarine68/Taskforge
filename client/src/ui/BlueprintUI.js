import { BlueprintManager } from '../game/BlueprintManager.js';

export class BlueprintUI {
  constructor(container, craftingSystem, player) {
    this.container = container;
    this.craftingSystem = craftingSystem;
    this.player = player;
    this.element = null;
    this.create();
  }

  create() {
    this.element = document.createElement('div');
    this.element.id = 'blueprint-ui';
    this.element.innerHTML = `
      <div class="blueprint-panel">
        <h3 class="blueprint-title">Blueprints</h3>
        <div class="blueprint-list" id="blueprint-list"></div>
        <button class="close-button" id="close-blueprint-ui">Close</button>
      </div>
    `;

    // Add styles (similar to building UI)
    const style = document.createElement('style');
    style.textContent = `
      #blueprint-ui {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2000;
      }

      .blueprint-panel {
        background: rgba(26, 26, 26, 0.95);
        border: 3px solid #6FD6FF;
        border-radius: 12px;
        padding: 20px;
        min-width: 400px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      }

      .blueprint-title {
        color: #6FD6FF;
        margin: 0 0 15px 0;
        font-size: 24px;
        text-align: center;
        border-bottom: 2px solid #6FD6FF;
        padding-bottom: 10px;
      }

      .blueprint-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
      }

      .blueprint-item {
        background: rgba(111, 214, 255, 0.1);
        border: 1px solid #6FD6FF;
        border-radius: 6px;
        padding: 15px;
      }

      .blueprint-item.locked {
        opacity: 0.5;
      }

      .blueprint-item-name {
        color: #ffffff;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .blueprint-item-description {
        color: #aaaaaa;
        font-size: 14px;
        margin-bottom: 10px;
      }

      .blueprint-item-requirements {
        color: #6FD6FF;
        font-size: 12px;
        margin-bottom: 10px;
      }

      .blueprint-item-result {
        color: #90EE90;
        font-size: 12px;
        margin-bottom: 10px;
      }

      .craft-button {
        width: 100%;
        padding: 8px;
        background: rgba(111, 214, 255, 0.2);
        border: 1px solid #6FD6FF;
        border-radius: 6px;
        color: #6FD6FF;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
      }

      .craft-button:hover:not(:disabled) {
        background: rgba(111, 214, 255, 0.3);
      }

      .craft-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .close-button {
        width: 100%;
        padding: 10px;
        background: rgba(111, 214, 255, 0.2);
        border: 1px solid #6FD6FF;
        border-radius: 6px;
        color: #6FD6FF;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
      }

      .close-button:hover {
        background: rgba(111, 214, 255, 0.3);
      }
    `;
    document.head.appendChild(style);

    this.populateBlueprints();
    this.setupEventListeners();
  }

  populateBlueprints() {
    const list = this.element.querySelector('#blueprint-list');
    list.innerHTML = '';

    const blueprintManager = this.craftingSystem.getBlueprintManager();
    blueprintManager.getAllBlueprints().forEach(blueprint => {
      const item = document.createElement('div');
      item.className = `blueprint-item ${blueprint.unlocked ? '' : 'locked'}`;

      const requirementsText = Object.entries(blueprint.requirements)
        .map(([resource, amount]) => `${amount} ${resource}`)
        .join(', ');

      const canCraft = blueprint.unlocked && (window.adminMode || blueprint.canCraft(this.player.inventory));

      item.innerHTML = `
        <div class="blueprint-item-name">${blueprint.name} ${blueprint.unlocked ? '' : '(Locked)'}</div>
        <div class="blueprint-item-description">${blueprint.description}</div>
        <div class="blueprint-item-requirements">Requires: ${requirementsText}</div>
        <div class="blueprint-item-result">Result: ${blueprint.result.count}x ${blueprint.result.type}</div>
        ${blueprint.unlocked ? `
          <button class="craft-button" ${canCraft ? '' : 'disabled'}>
            Craft
          </button>
        ` : ''}
      `;

      if (blueprint.unlocked) {
        const craftButton = item.querySelector('.craft-button');
        if (craftButton && canCraft) {
          craftButton.addEventListener('click', () => {
            if (this.craftingSystem.craft(blueprint.id, this.player.inventory)) {
              this.populateBlueprints(); // Refresh
            }
          });
        }
      }

      list.appendChild(item);
    });
  }

  setupEventListeners() {
    const closeButton = this.element.querySelector('#close-blueprint-ui');
    closeButton.addEventListener('click', () => {
      this.hide();
    });
  }

  show() {
    if (!this.element.parentNode) {
      this.container.appendChild(this.element);
    }
    this.element.style.display = 'block';
    this.populateBlueprints();
  }

  hide() {
    if (this.element) {
      this.element.style.display = 'none';
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

