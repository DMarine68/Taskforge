export class WebSocketClient {
  constructor() {
    this.ws = null;
    this.roomCode = null;
    this.playerId = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(url = 'ws://localhost:8080') {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('Connected to server');
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        console.log('Disconnected from server');
      };
    });
  }

  handleMessage(data) {
    const listeners = this.listeners.get(data.type) || [];
    listeners.forEach(listener => listener(data));
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  createRoom(playerId) {
    this.playerId = playerId;
    this.send({ type: 'createRoom', playerId });
  }

  joinRoom(roomCode, playerId) {
    this.playerId = playerId;
    this.roomCode = roomCode;
    this.send({ type: 'joinRoom', roomCode, playerId });
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  updateState(state) {
    this.send({ type: 'updateState', ...state });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}


