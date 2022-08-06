import BattleshipDomController from './domcontroller';
import Player from './player';
import PlayerAI from './playerai';
import './style.css';

const boardSize = 10;

const startGameButton = document.getElementById('addShip');

function game() {
  const playerObj = new Player(boardSize, boardSize);
  const computerObj = new PlayerAI(boardSize, boardSize);
  const domController = new BattleshipDomController('content', 'player', 'computer', boardSize, boardSize, playerObj, computerObj);
  startGameButton.addEventListener('click', () => {
    domController.placeShips(playerObj, computerObj);
  }, { once: true });
}

game();
