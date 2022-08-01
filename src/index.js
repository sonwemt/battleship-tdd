import BattleshipPage from './display';
import Player from './player';
import PlayerAI from './playerai';
import './style.css';

const boardSize = 10;
const numberOfShips = 5;
let placedShips = 0;
const shipLength = 5;
const pageContainer = document.getElementById('content');
const player = new Player(boardSize, boardSize);
const computerPlayer = new PlayerAI(boardSize, boardSize);
const playerGrid = new BattleshipPage('content', boardSize, boardSize);
const computerGrid = new BattleshipPage('content', boardSize, boardSize);
const addShipButton = document.getElementById('addShip');
const abortHandler = new AbortController();
const victoryText = document.getElementById('winText');

function onShipDestruct(ship, playerName) {
  for (let i = 0; i < ship.hull.length; i += 1) {
    const shipPosition = document.querySelector(`${playerName} .row .gridsquare[data-x="${ship.hull[i].x}"][data-y="${ship.hull[i].y}"]`);
    shipPosition.setAttribute('class', 'gridsquare sunk');
  }
}

function onGameOver(playerWin, playerLost) {
  const winningPlayerGrid = document.querySelector(`${playerWin}`);
  const losingPlayerGrid = document.querySelector(`${playerLost}`);

  winningPlayerGrid.classList.add('won');
  losingPlayerGrid.classList.add('lost');
}

function computerTurn() {
  const computerTurnResult = computerPlayer.attack(player);
  const lastAttackedPos = computerPlayer.lastAttackedGrid;
  const attackedSquare = document.querySelector(`.computer .row .gridsquare[data-x="${lastAttackedPos.x}"][data-y="${lastAttackedPos.y}"]`);
  const attackedShipObj = player.getShipObject(lastAttackedPos.x, lastAttackedPos.y);

  switch (computerTurnResult) {
    case true:
      attackedSquare.setAttribute('class', 'gridsquare hit');
      break;
    case false:
      console.log('gameover');
      break;
    case 'hit':
      attackedSquare.setAttribute('class', 'gridsquare waterhit');
      break;
    case 'sunk':
      onShipDestruct(attackedShipObj, '.computer');
      break;
    default:
      console.log('receivehit returned error');
  }
}

function playerTurn(e) {
  player.x = e.target.getAttribute('data-x');
  player.y = e.target.getAttribute('data-y');

  switch (player.attack(computerPlayer)) {
    case true:
      e.target.setAttribute('class', 'gridsquare hit');
      break;
    case false:
      return;
    case 'hit':
      e.target.setAttribute('class', 'gridsquare waterhit');
      break;
    case 'sunk':
      console.log('sunk');
      onShipDestruct(computerPlayer.getShipObject(e.target.getAttribute('data-x'), e.target.getAttribute('data-y')), '.player');
      break;
    default:
      console.log('receivehit returned error');
  }
}

function addGameEventListeners() {
  const playerSquares = document.querySelectorAll('.player .row .gridsquare');

  playerSquares.forEach((square) => {
    square.addEventListener('click', (e) => {
      playerTurn(e);
      if (!computerPlayer.shipsInPlay()) {
        onGameOver('.player', '.computer');
        abortHandler.abort();
        victoryText.textContent = 'You win!';
      }

      computerTurn();
      if (!player.shipsInPlay()) {
        onGameOver('.computer', '.player');
        abortHandler.abort();
        victoryText.textContent = 'The computer wins!';
      }
    }, { once: true }, { signal: abortHandler.signal });
  });
}

function placeShip(playerObj, length) {
  const computerSquares = document.querySelectorAll('.computer .row .gridsquare');
  let orientation = true;
  const orientButton = document.createElement('button');
  orientButton.id = 'orientButton';
  orientButton.textContent = 'Change orientation';
  pageContainer.appendChild(orientButton);
  orientButton.addEventListener('click', () => {
    if (orientation) {
      orientation = false;
    } else {
      orientation = true;
    }
  });
  computerSquares.forEach((square) => {
    square.addEventListener('click', (e) => {
      const clickedPosition = { x: Number(e.target.getAttribute('data-x')), y: Number(e.target.getAttribute('data-y')) };
      if (playerObj.placeShip(clickedPosition.x, clickedPosition.y, orientation, shipLength)) {
        for (let i = 0; i < length; i += 1) {
          if (orientation) {
            const squareToChange = document.querySelector(`.computer .row .gridsquare[data-x="${clickedPosition.x + i}"][data-y="${clickedPosition.y}"]`);
            squareToChange.setAttribute('class', 'gridsquare placedship');
          } else {
            const squareToChange = document.querySelector(`.computer .row .gridsquare[data-x="${clickedPosition.x}"][data-y="${clickedPosition.y + i}"]`);
            squareToChange.setAttribute('class', 'gridsquare placedship');
          }
        }

        computerPlayer.placeShip(shipLength);

        placedShips += 1;
        if (placedShips === numberOfShips) {
          orientButton.remove();
          abortHandler.abort();
          addGameEventListeners();
        }
        addShipButton.remove();
      }
    }, { signal: abortHandler.signal });
  });
}

function battleShipMainLoop() {
  playerGrid.createGrid('player');
  computerGrid.createGrid('computer');
}

addShipButton.addEventListener('click', () => {
  placeShip(player, shipLength);
});

battleShipMainLoop();
