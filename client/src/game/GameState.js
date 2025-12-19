export class GameState {
  static MENU = 'menu';
  static PLAYING = 'playing';
  static PAUSED = 'paused';
  static LOADING = 'loading';

  constructor() {
    this.currentState = GameState.MENU;
    this.listeners = new Map();
  }

  setState(newState) {
    if (this.currentState === newState) return;

    const oldState = this.currentState;
    this.currentState = newState;

    // Notify listeners
    const stateListeners = this.listeners.get(newState) || [];
    stateListeners.forEach(listener => listener(newState, oldState));

    // Notify general state change listeners
    const changeListeners = this.listeners.get('*') || [];
    changeListeners.forEach(listener => listener(newState, oldState));
  }

  getState() {
    return this.currentState;
  }

  onStateChange(state, callback) {
    if (!this.listeners.has(state)) {
      this.listeners.set(state, []);
    }
    this.listeners.get(state).push(callback);
  }

  removeListener(state, callback) {
    const listeners = this.listeners.get(state);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
}


