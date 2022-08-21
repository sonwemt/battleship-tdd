import BattleshipDomController from './domcontroller';
import Player from './player';
import PlayerAI from './playerai';
import './style.css';

function game() {
  const boardSize = 10;

  const gameOptions = document.getElementById('gameOptions');

  const startGameButton = document.createElement('button');
  startGameButton.id = 'startGame';
  startGameButton.textContent = 'Start Game';
  gameOptions.appendChild(startGameButton);

  const restartGameButton = document.createElement('button');
  restartGameButton.id = 'restartGame';
  restartGameButton.textContent = 'Restart game';

  const idObj = {
    page: 'content',
    player: 'player',
    computer: 'computer',
    gameOptions: 'gameOptions',
  };
  const playerObj = new Player(boardSize, boardSize);
  const computerObj = new PlayerAI(boardSize, boardSize);
  const domController = new BattleshipDomController(
    idObj,
    boardSize,
    boardSize,
    playerObj,
    computerObj,
  );

  startGameButton.addEventListener('click', () => {
    domController.placeShips(playerObj, computerObj);
    startGameButton.remove();
    gameOptions.appendChild(restartGameButton);
  });

  restartGameButton.addEventListener('click', () => {
    domController.clearGrids();
    game();
  });
}

game();
