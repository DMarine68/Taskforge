export class PauseMenu {
  constructor(container, gameState) {
    this.container = container;
    this.gameState = gameState;
    this.element = null;
    this.onResumeCallback = null;
    this.onQuitToMenuCallback = null;
    this.onSettingsCallback = null;
    this.create();
    this.setupKeyboardListener();
  }

  create() {
    this.element = document.createElement('div');
    this.element.id = 'pause-menu';
    this.element.innerHTML = `
      <div class="pause-content">
        <h2 class="pause-title">Paused</h2>
        <div class="pause-buttons">
          <button class="pause-button" id="resume-button">
            <span class="button-text">Resume</span>
          </button>
          <button class="pause-button" id="settings-button">
            <span class="button-text">Settings</span>
          </button>
          <button class="pause-button" id="quit-to-menu-button">
            <span class="button-text">Quit to Menu</span>
          </button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #pause-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 3000;
        backdrop-filter: blur(5px);
      }

      #pause-menu.visible {
        display: flex;
      }

      .pause-content {
        text-align: center;
        padding: 40px;
        background: rgba(26, 26, 26, 0.95);
        border: 3px solid #6FD6FF;
        border-radius: 12px;
        box-shadow: 0 0 30px rgba(111, 214, 255, 0.5);
      }

      .pause-title {
        color: #6FD6FF;
        font-size: 48px;
        margin: 0 0 40px 0;
        text-shadow: 0 0 20px rgba(111, 214, 255, 0.6);
        font-family: 'Arial', sans-serif;
      }

      .pause-buttons {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
      }

      .pause-button {
        background: rgba(26, 26, 26, 0.8);
        border: 2px solid #6FD6FF;
        border-radius: 8px;
        color: #6FD6FF;
        font-size: 20px;
        padding: 12px 30px;
        min-width: 200px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Arial', sans-serif;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }

      .pause-button:hover {
        background: rgba(111, 214, 255, 0.2);
        box-shadow: 0 0 20px rgba(111, 214, 255, 0.5);
        transform: translateY(-2px);
      }

      .pause-button:active {
        transform: translateY(0);
      }

      .button-text {
        text-shadow: 0 0 10px rgba(111, 214, 255, 0.5);
      }
    `;
    document.head.appendChild(style);

    this.setupEventListeners();
  }

  setupEventListeners() {
    const resumeButton = this.element.querySelector('#resume-button');
    const settingsButton = this.element.querySelector('#settings-button');
    const quitToMenuButton = this.element.querySelector('#quit-to-menu-button');

    resumeButton.addEventListener('click', () => {
      this.hide();
      if (this.onResumeCallback) {
        this.onResumeCallback();
      }
    });

    settingsButton.addEventListener('click', () => {
      this.hide(); // Hide pause menu when opening settings
      if (this.onSettingsCallback) {
        this.onSettingsCallback();
      }
    });

    quitToMenuButton.addEventListener('click', () => {
      this.hide();
      if (this.onQuitToMenuCallback) {
        this.onQuitToMenuCallback();
      }
    });
  }

  setupKeyboardListener() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.gameState.getState() === 'playing') {
          this.show();
          this.gameState.setState('paused');
        } else if (this.gameState.getState() === 'paused') {
          this.hide();
          this.gameState.setState('playing');
        }
      }
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

  onResume(callback) {
    this.onResumeCallback = callback;
  }

  onQuitToMenu(callback) {
    this.onQuitToMenuCallback = callback;
  }

  onSettings(callback) {
    this.onSettingsCallback = callback;
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

