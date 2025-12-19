export class ProgramEditor {
  constructor(container, villager) {
    this.container = container;
    this.villager = villager;
    this.element = null;
    this.create();
  }

  create() {
    this.element = document.createElement('div');
    this.element.id = 'program-editor';
    this.element.innerHTML = `
      <div class="editor-panel">
        <h3 class="editor-title">Program Editor - Villager</h3>
        <div class="editor-content">
          <div class="command-palette">
            <h4>Commands</h4>
            <div class="command-list" id="command-list"></div>
          </div>
          <div class="program-canvas">
            <h4>Program</h4>
            <div class="program-nodes" id="program-nodes"></div>
          </div>
        </div>
        <div class="editor-buttons">
          <button class="editor-button" id="save-program">Save</button>
          <button class="editor-button" id="test-program">Test</button>
          <button class="editor-button" id="close-editor">Close</button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #program-editor {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3000;
      }

      .editor-panel {
        background: rgba(26, 26, 26, 0.95);
        border: 3px solid #6FD6FF;
        border-radius: 12px;
        padding: 20px;
        min-width: 600px;
        max-width: 800px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
      }

      .editor-title {
        color: #6FD6FF;
        margin: 0 0 15px 0;
        text-align: center;
        border-bottom: 2px solid #6FD6FF;
        padding-bottom: 10px;
      }

      .editor-content {
        display: flex;
        gap: 20px;
        flex: 1;
        overflow: hidden;
      }

      .command-palette, .program-canvas {
        flex: 1;
        border: 1px solid #6FD6FF;
        border-radius: 6px;
        padding: 10px;
        overflow-y: auto;
      }

      .command-list, .program-nodes {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .command-item, .program-node {
        background: rgba(111, 214, 255, 0.1);
        border: 1px solid #6FD6FF;
        border-radius: 4px;
        padding: 10px;
        cursor: pointer;
      }

      .editor-buttons {
        display: flex;
        gap: 10px;
        margin-top: 15px;
      }

      .editor-button {
        flex: 1;
        padding: 10px;
        background: rgba(111, 214, 255, 0.2);
        border: 1px solid #6FD6FF;
        border-radius: 6px;
        color: #6FD6FF;
        cursor: pointer;
      }

      .editor-button:hover {
        background: rgba(111, 214, 255, 0.3);
      }
    `;
    document.head.appendChild(style);

    this.setupEventListeners();
  }

  setupEventListeners() {
    const closeButton = this.element.querySelector('#close-editor');
    closeButton.addEventListener('click', () => this.hide());
  }

  show() {
    if (!this.element.parentNode) {
      this.container.appendChild(this.element);
    }
    this.element.style.display = 'block';
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


