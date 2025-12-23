export class SettingsMenu {
  constructor(container, tileGrid = null) {
    this.container = container;
    this.tileGrid = tileGrid;
    this.element = null;
    this.gridVisible = true; // Default to visible
    this.onCloseCallback = null;
    this.loadSettings(); // Load saved settings
    this.create();
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('taskforge_gridVisible');
      if (saved !== null) {
        this.gridVisible = saved === 'true';
      }
    } catch (error) {
      console.warn('Failed to load grid visibility setting:', error);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('taskforge_gridVisible', this.gridVisible.toString());
    } catch (error) {
      console.warn('Failed to save grid visibility setting:', error);
    }
  }

  create() {
    this.element = document.createElement('div');
    this.element.id = 'settings-menu';
    this.element.innerHTML = `
      <div class="settings-background"></div>
      <div class="settings-content">
        <h2 class="settings-title">Settings</h2>
        <div class="settings-options">
          ${this.tileGrid ? `
          <div class="settings-option">
            <label class="settings-label">Show Grid</label>
            <button class="grid-toggle-button ${this.gridVisible ? 'on' : 'off'}" id="grid-toggle">
              ${this.gridVisible ? 'On' : 'Off'}
            </button>
          </div>
          ` : `
          <div class="settings-option">
            <p class="settings-info">Game settings will be available after starting a game.</p>
          </div>
          `}
        </div>
        <div class="settings-buttons">
          <button class="settings-button" id="close-settings-button">Close</button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #settings-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 4000;
        backdrop-filter: blur(8px);
      }

      #settings-menu.visible {
        display: flex;
      }

      .settings-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, #87CEEB 0%, #B0E0E6 50%, #87CEEB 100%);
        background-size: 100% 200%;
        animation: skyShift 20s ease infinite;
        opacity: 0.85;
      }

      @keyframes skyShift {
        0%, 100% { background-position: 0% 0%; }
        50% { background-position: 0% 100%; }
      }

      .settings-content {
        position: relative;
        z-index: 1;
        text-align: center;
        padding: 50px 60px;
        background: rgba(255, 255, 255, 0.95);
        border: 3px solid #34495e;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        min-width: 400px;
        max-width: 500px;
        animation: fadeInScale 0.3s ease-out;
      }

      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .settings-title {
        color: #1a1a1a;
        font-size: 42px;
        margin: 0 0 40px 0;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        font-family: 'Arial', sans-serif;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      .settings-options {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 30px;
        align-items: flex-start;
        width: 100%;
      }

      .settings-option {
        width: 100%;
      }

      .settings-label {
        display: block;
        color: #1a1a1a !important;
        font-size: 18px;
        margin-bottom: 12px;
        font-family: 'Arial', sans-serif;
        font-weight: 600;
      }

      .grid-toggle-button {
        position: relative;
        background: rgba(231, 76, 60, 0.9);
        border: 3px solid #e74c3c;
        border-radius: 8px;
        color: #ffffff;
        font-size: 18px;
        padding: 12px 40px;
        min-width: 100px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: 'Arial', sans-serif;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        text-transform: uppercase;
        letter-spacing: 1px;
        overflow: hidden;
      }

      .grid-toggle-button.on {
        background: rgba(46, 204, 113, 0.9);
        border-color: #2ecc71;
        color: #ffffff;
      }

      .grid-toggle-button.off {
        background: rgba(231, 76, 60, 0.9);
        border-color: #e74c3c;
        color: #ffffff;
      }

      .grid-toggle-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.4s ease;
      }

      .grid-toggle-button:hover::before {
        left: 100%;
      }

      .grid-toggle-button:hover {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        transform: translateY(-2px);
      }

      .grid-toggle-button.on:hover {
        border-color: #27ae60;
        background: rgba(39, 174, 96, 1);
      }

      .grid-toggle-button.off:hover {
        border-color: #c0392b;
        background: rgba(192, 57, 43, 1);
      }

      .grid-toggle-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .settings-info {
        color: #1a1a1a;
        font-size: 16px;
        font-family: 'Arial', sans-serif;
        font-style: italic;
        text-align: center;
        margin: 0;
        opacity: 0.8;
      }

      .settings-buttons {
        display: flex;
        gap: 20px;
        justify-content: center;
        margin-top: 20px;
      }

      .settings-button {
        position: relative;
        background: rgba(255, 255, 255, 0.95);
        border: 3px solid #34495e;
        border-radius: 8px;
        color: #1a1a1a;
        font-size: 18px;
        padding: 12px 40px;
        min-width: 150px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: 'Arial', sans-serif;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        text-transform: uppercase;
        letter-spacing: 1px;
        overflow: hidden;
      }

      .settings-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(52, 73, 94, 0.1), transparent);
        transition: left 0.4s ease;
      }

      .settings-button:hover::before {
        left: 100%;
      }

      .settings-button:hover {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        transform: translateY(-2px);
        border-color: #2c3e50;
      }

      .settings-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
    `;
    document.head.appendChild(style);

    this.setupEventListeners();
    this.setupKeyboardListener();
  }

  setupKeyboardListener() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.element.classList.contains('visible')) {
        this.hide();
        if (this.onCloseCallback) {
          this.onCloseCallback();
        }
      }
    });
  }

  setupEventListeners() {
    const gridToggle = this.element.querySelector('#grid-toggle');
    const closeButton = this.element.querySelector('#close-settings-button');

    if (gridToggle) {
      gridToggle.addEventListener('click', () => {
        this.gridVisible = !this.gridVisible;
        this.updateToggleButton();
        this.updateGridVisibility();
        this.saveSettings();
      });
    }

    closeButton.addEventListener('click', () => {
      this.hide();
      if (this.onCloseCallback) {
        this.onCloseCallback();
      }
    });
  }

  updateToggleButton() {
    const gridToggle = this.element.querySelector('#grid-toggle');
    if (gridToggle) {
      gridToggle.textContent = this.gridVisible ? 'On' : 'Off';
      gridToggle.className = `grid-toggle-button ${this.gridVisible ? 'on' : 'off'}`;
    }
  }

  setTileGrid(tileGrid) {
    this.tileGrid = tileGrid;
    // Update the UI if settings menu is already created
    if (this.element && tileGrid) {
      const settingsOptions = this.element.querySelector('.settings-options');
      if (settingsOptions && !settingsOptions.querySelector('#grid-toggle')) {
        settingsOptions.innerHTML = `
          <div class="settings-option">
            <label class="settings-label">Show Grid</label>
            <button class="grid-toggle-button ${this.gridVisible ? 'on' : 'off'}" id="grid-toggle">
              ${this.gridVisible ? 'On' : 'Off'}
            </button>
          </div>
        `;
        const gridToggle = this.element.querySelector('#grid-toggle');
        if (gridToggle) {
          gridToggle.addEventListener('click', () => {
            this.gridVisible = !this.gridVisible;
            this.updateToggleButton();
            this.updateGridVisibility();
            this.saveSettings();
          });
        }
      }
    }
    // Apply the saved setting to the grid immediately
    this.updateGridVisibility();
  }

  updateGridVisibility() {
    if (this.tileGrid && this.tileGrid.gridHelper) {
      this.tileGrid.gridHelper.visible = this.gridVisible;
    }
  }

  getGridVisible() {
    return this.gridVisible;
  }

  show() {
    if (!this.element.parentNode) {
      this.container.appendChild(this.element);
    }
    // Reload settings in case they were changed elsewhere
    this.loadSettings();
    // Update toggle button to reflect current state
    this.updateToggleButton();
    // Apply the setting to the grid
    this.updateGridVisibility();
    this.element.classList.add('visible');
  }

  hide() {
    this.element.classList.remove('visible');
  }

  onClose(callback) {
    this.onCloseCallback = callback;
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

