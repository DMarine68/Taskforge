export class MainMenu {
  constructor(container, gameState, audioManager) {
    this.container = container;
    this.gameState = gameState;
    this.audioManager = audioManager;
    this.element = null;
    this.onPlayCallback = null;
    this.onMultiplayerCallback = null;
    this.create();
  }

  create() {
    this.element = document.createElement('div');
    this.element.id = 'main-menu';
    this.element.innerHTML = `
      <div class="menu-content">
        <div class="menu-logo">
          <img src="public/images/taskforge_logo.png" alt="Taskforge" class="logo-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <h1 class="logo-text" style="display: none;">Taskforge</h1>
          <p class="logo-subtitle">Automation</p>
        </div>
        <div class="menu-buttons">
          <button class="menu-button" id="play-button">
            <span class="button-text">Play</span>
          </button>
          <button class="menu-button" id="multiplayer-button">
            <span class="button-text">Multiplayer</span>
          </button>
          <button class="menu-button" id="settings-button">
            <span class="button-text">Settings</span>
          </button>
          <button class="menu-button" id="quit-button">
            <span class="button-text">Quit</span>
          </button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #main-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        transition: opacity 0.3s ease-out;
      }

      #main-menu.hidden {
        opacity: 0;
        pointer-events: none;
      }

      .menu-content {
        text-align: center;
        padding: 40px;
      }

      .menu-logo {
        margin-bottom: 60px;
      }

      .logo-image {
        max-width: 400px;
        max-height: 200px;
        margin-bottom: 20px;
      }

      .logo-text {
        color: #6FD6FF;
        font-size: 64px;
        margin: 0 0 10px 0;
        text-shadow: 0 0 30px rgba(111, 214, 255, 0.6);
        font-family: 'Arial', sans-serif;
      }

      .logo-subtitle {
        color: #6FD6FF;
        font-size: 32px;
        margin: 0;
        text-shadow: 0 0 20px rgba(111, 214, 255, 0.4);
        font-family: 'Arial', sans-serif;
      }

      .menu-buttons {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
      }

      .menu-button {
        background: rgba(26, 26, 26, 0.8);
        border: 2px solid #6FD6FF;
        border-radius: 8px;
        color: #6FD6FF;
        font-size: 24px;
        padding: 15px 40px;
        min-width: 250px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Arial', sans-serif;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }

      .menu-button:hover {
        background: rgba(111, 214, 255, 0.2);
        box-shadow: 0 0 20px rgba(111, 214, 255, 0.5);
        transform: translateY(-2px);
      }

      .menu-button:active {
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
    const playButton = this.element.querySelector('#play-button');
    const multiplayerButton = this.element.querySelector('#multiplayer-button');
    const settingsButton = this.element.querySelector('#settings-button');
    const quitButton = this.element.querySelector('#quit-button');

    playButton.addEventListener('click', () => {
      if (this.onPlayCallback) {
        this.onPlayCallback();
      }
    });

    multiplayerButton.addEventListener('click', () => {
      if (this.onMultiplayerCallback) {
        this.onMultiplayerCallback();
      }
    });

    settingsButton.addEventListener('click', () => {
      // Placeholder for settings
      console.log('Settings clicked');
    });

    quitButton.addEventListener('click', () => {
      if (window.electronAPI) {
        // Electron app
        window.electronAPI.quit();
      } else {
        // Web browser
        window.close();
      }
    });
  }

  show() {
    if (!this.element.parentNode) {
      this.container.appendChild(this.element);
    }
    this.element.classList.remove('hidden');
    
    // Play menu music
    if (this.audioManager) {
      this.audioManager.playMusic('main_menu');
    }
  }

  hide() {
    this.element.classList.add('hidden');
    
    // Stop menu music
    if (this.audioManager) {
      this.audioManager.stopMusic();
    }
  }

  onPlay(callback) {
    this.onPlayCallback = callback;
  }

  onMultiplayer(callback) {
    this.onMultiplayerCallback = callback;
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}


