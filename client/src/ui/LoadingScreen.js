export class LoadingScreen {
  constructor(container) {
    this.container = container;
    this.element = null;
    this.create();
  }

  create() {
    this.element = document.createElement('div');
    this.element.id = 'loading-screen';
    this.element.innerHTML = `
      <div class="loading-content">
        <div class="loading-logo">
          <h1 style="color: #6FD6FF; font-size: 48px; margin-bottom: 20px;">Taskforge</h1>
          <p style="color: #6FD6FF; font-size: 24px;">Automation</p>
        </div>
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <p class="loading-text">Loading...</p>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        transition: opacity 0.5s ease-out;
      }

      #loading-screen.hidden {
        opacity: 0;
        pointer-events: none;
      }

      .loading-content {
        text-align: center;
      }

      .loading-logo h1 {
        font-family: 'Arial', sans-serif;
        text-shadow: 0 0 20px rgba(111, 214, 255, 0.5);
        margin-bottom: 10px;
      }

      .loading-logo p {
        font-family: 'Arial', sans-serif;
        text-shadow: 0 0 10px rgba(111, 214, 255, 0.3);
      }

      .loading-spinner {
        margin: 30px 0;
      }

      .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(111, 214, 255, 0.3);
        border-top: 4px solid #6FD6FF;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .loading-text {
        color: #6FD6FF;
        font-size: 18px;
        margin-top: 20px;
        font-family: 'Arial', sans-serif;
      }
    `;
    document.head.appendChild(style);
  }

  show() {
    if (!this.element.parentNode) {
      this.container.appendChild(this.element);
    }
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
    setTimeout(() => {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }, 500);
  }
}


