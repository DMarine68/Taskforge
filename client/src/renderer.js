import { Game } from './game/Game.js';
import './styles/main.css';

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('game-container');
  const game = new Game(container);
  game.init();
});


