const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const rooms = new Map(); // roomCode -> { clients: Set, state: Object }

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleMessage(ws, data);
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // Remove client from rooms
    rooms.forEach((room, code) => {
      if (room.clients.has(ws)) {
        room.clients.delete(ws);
        if (room.clients.size === 0) {
          rooms.delete(code);
        } else {
          broadcastToRoom(code, { type: 'playerLeft', playerId: ws.id });
        }
      }
    });
  });
});

function handleMessage(ws, data) {
  switch (data.type) {
    case 'createRoom':
      const roomCode = generateRoomCode();
      rooms.set(roomCode, {
        clients: new Set([ws]),
        state: { players: [], buildings: [], resources: [] }
      });
      ws.id = data.playerId || Math.random().toString(36);
      ws.roomCode = roomCode;
      ws.send(JSON.stringify({ type: 'roomCreated', roomCode }));
      console.log(`Room created: ${roomCode}`);
      break;

    case 'joinRoom':
      const room = rooms.get(data.roomCode);
      if (room) {
        room.clients.add(ws);
        ws.id = data.playerId || Math.random().toString(36);
        ws.roomCode = data.roomCode;
        ws.send(JSON.stringify({ type: 'roomJoined', roomCode: data.roomCode, state: room.state }));
        broadcastToRoom(data.roomCode, { type: 'playerJoined', playerId: ws.id }, ws);
        console.log(`Player joined room: ${data.roomCode}`);
      } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
      }
      break;

    case 'updateState':
      if (ws.roomCode) {
        const room = rooms.get(ws.roomCode);
        if (room) {
          // Update room state
          if (data.playerPosition) {
            const playerIndex = room.state.players.findIndex(p => p.id === ws.id);
            if (playerIndex >= 0) {
              room.state.players[playerIndex].position = data.playerPosition;
            } else {
              room.state.players.push({ id: ws.id, position: data.playerPosition });
            }
          }
          // Broadcast to other clients
          broadcastToRoom(ws.roomCode, data, ws);
        }
      }
      break;

    default:
      console.log('Unknown message type:', data.type);
  }
}

function broadcastToRoom(roomCode, message, exclude = null) {
  const room = rooms.get(roomCode);
  if (room) {
    room.clients.forEach(client => {
      if (client !== exclude && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}

console.log('WebSocket server running on port 8080');


