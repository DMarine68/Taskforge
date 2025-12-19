export class InventoryUI {
  constructor(container, inventory) {
    this.container = container;
    this.inventory = inventory;
    this.element = null;
    this.create();
  }

  create() {
    this.element = document.createElement('div');
    this.element.id = 'inventory-ui';
    this.element.innerHTML = `
      <div class="inventory-panel">
        <h3 class="inventory-title">Inventory</h3>
        <div class="inventory-items" id="inventory-items"></div>
        <div class="inventory-stats">
          <span id="inventory-count">0 / 20</span>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #inventory-ui {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
      }

      .inventory-panel {
        background: rgba(26, 26, 26, 0.9);
        border: 2px solid #6FD6FF;
        border-radius: 8px;
        padding: 15px;
        min-width: 200px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }

      .inventory-title {
        color: #6FD6FF;
        margin: 0 0 10px 0;
        font-size: 18px;
        text-align: center;
        border-bottom: 1px solid #6FD6FF;
        padding-bottom: 8px;
      }

      .inventory-items {
        min-height: 100px;
        max-height: 300px;
        overflow-y: auto;
      }

      .inventory-item {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        margin: 4px 0;
        background: rgba(111, 214, 255, 0.1);
        border-radius: 4px;
        border-left: 3px solid #6FD6FF;
      }

      .inventory-item-name {
        color: #ffffff;
        text-transform: capitalize;
      }

      .inventory-item-count {
        color: #6FD6FF;
        font-weight: bold;
      }

      .inventory-stats {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #6FD6FF;
        text-align: center;
        color: #6FD6FF;
        font-size: 14px;
      }

      .inventory-empty {
        text-align: center;
        color: #888;
        padding: 20px;
        font-style: italic;
      }
    `;
    document.head.appendChild(style);

    if (!this.container.contains(this.element)) {
      this.container.appendChild(this.element);
    }

    this.update();
  }

  update() {
    if (!this.element || !this.inventory) return;

    const itemsContainer = this.element.querySelector('#inventory-items');
    const countElement = this.element.querySelector('#inventory-count');

    // Update count
    if (countElement) {
      countElement.textContent = `${this.inventory.currentSize} / ${this.inventory.maxSize}`;
    }

    // Update items
    if (itemsContainer) {
      itemsContainer.innerHTML = '';

      if (this.inventory.isEmpty()) {
        itemsContainer.innerHTML = '<div class="inventory-empty">Inventory is empty</div>';
      } else {
        const allItems = this.inventory.getAllItems();
        allItems.forEach(({ type, count }) => {
          const itemElement = document.createElement('div');
          itemElement.className = 'inventory-item';
          itemElement.innerHTML = `
            <span class="inventory-item-name">${type}</span>
            <span class="inventory-item-count">x${count}</span>
          `;
          itemsContainer.appendChild(itemElement);
        });
      }
    }
  }

  show() {
    if (this.element) {
      this.element.style.display = 'block';
    }
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


