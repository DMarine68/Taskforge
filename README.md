# Taskforge: Automation

An Autonauts-style visual programming automation game built with Three.js and Electron.

## Setup

1. Install dependencies:
```bash
npm run install-all
```

2. Build the client (required before first run):
```bash
cd client
npm run build:dev
cd ..
```

3. Start the game:
```bash
npm start
```

Or from the client directory:
```bash
cd client
npm start
```

4. Build for production:
```bash
cd client
npm run build
```

## Development

For development with hot reload:
```bash
cd client
npm run dev
```

Then in another terminal, start Electron:
```bash
cd client
npm run electron
```

## Development

- Client runs on Electron
- Server runs separately: `npm run server`
- Web version: `cd client && npm run web`

## Project Structure

- `client/` - Electron + Three.js game client
- `server/` - WebSocket server for multiplayer
- `docs/` - Documentation and requirements

## Technology Stack

- Three.js for 3D rendering
- Electron for desktop app
- Node.js + WebSocket for multiplayer
- Webpack for bundling

