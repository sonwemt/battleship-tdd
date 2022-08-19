export default class BattleshipDomController {
  #pageContainer;

  #playerGrid;

  #computerGrid;

  #width;

  #height;

  #placedShips = 0;

  #numberOfShips = 5;

  #gameStatus = document.getElementById('gameStatus');

  constructor(pageContainer, playerGrid, computerGrid, width, height) {
    this.#pageContainer = document.getElementById(pageContainer);
    this.#playerGrid = document.getElementById(playerGrid);
    this.#computerGrid = document.getElementById(computerGrid);
    this.#width = width;
    this.#height = height;
    this.createGrids();
  }

  createGrids() {
    for (let y = this.#height - 1; y >= 0; y -= 1) {
      const row = document.createElement('div');
      row.setAttribute('class', 'row');
      for (let x = 0; x < this.#width; x += 1) {
        const square = document.createElement('div');
        square.setAttribute('data-x', x);
        square.setAttribute('data-y', y);
        square.setAttribute('class', 'gridsquare');
        row.appendChild(square);
      }
      this.#playerGrid.appendChild(row);
    }

    for (let y = this.#height - 1; y >= 0; y -= 1) {
      const row = document.createElement('div');
      row.setAttribute('class', 'row');
      for (let x = 0; x < this.#width; x += 1) {
        const square = document.createElement('div');
        square.setAttribute('data-x', x);
        square.setAttribute('data-y', y);
        square.setAttribute('class', 'gridsquare');
        row.appendChild(square);
      }
      this.#computerGrid.appendChild(row);
    }
  }

  placeShipOutline(orientation, playerObj, position) {
    for (let i = 0; i < playerObj.shipLengths[this.#placedShips]; i += 1) {
      if (orientation) {
        const squareToChange = document.querySelector(`#computer .row .gridsquare[data-x="${position.x + i}"][data-y="${position.y}"]`);
        squareToChange.setAttribute('class', 'gridsquare placedship');
      } else {
        const squareToChange = document.querySelector(`#computer .row .gridsquare[data-x="${position.x}"][data-y="${position.y + i}"]`);
        squareToChange.setAttribute('class', 'gridsquare placedship');
      }
    }
  }

  toggleShipPreview(orientation, playerObj, target) {
    const shipLength = playerObj.shipLengths[this.#placedShips];
    let previewClass;
    const position = { x: Number(target.getAttribute('data-x')), y: Number(target.getAttribute('data-y')) };
    for (let i = 0; i < shipLength; i += 1) {
      let squareToChange;
      if (orientation) {
        squareToChange = document.querySelector(`#computer .row .gridsquare[data-x="${position.x + i}"][data-y="${position.y}"]`);
      } else {
        squareToChange = document.querySelector(`#computer .row .gridsquare[data-x="${position.x}"][data-y="${position.y + i}"]`);
      }
      if (squareToChange === null) {
        return;
      }
      if (playerObj.placementValid(position.x, position.y, orientation, shipLength)) {
        previewClass = 'validPreview';
      } else {
        previewClass = 'invalidPreview';
      }
      if (!squareToChange.classList.contains('placedship')) {
        squareToChange.classList.toggle(previewClass);
      }
    }
  }

  onShipDestruct(ship, playerName) {
    for (let i = 0; i < ship.length; i += 1) {
      const shipPosition = document.querySelector(`${playerName} .row .gridsquare[data-x="${ship.hull[i].x}"][data-y="${ship.hull[i].y}"]`);
      shipPosition.setAttribute('class', 'gridsquare sunk');
    }
    return this;
  }

  onGameOver(playerWin, playerLost) {
    const winningPlayerGrid = document.querySelector(`${playerWin}`);
    const losingPlayerGrid = document.querySelector(`${playerLost}`);

    winningPlayerGrid.classList.add('won');
    losingPlayerGrid.classList.add('lost');
    return this;
  }

  computerTurn(playerObj, computerObj) {
    const computerTurnResult = computerObj.attack(playerObj);
    const lastAttackedPos = computerObj.lastAttackedGrid;
    const attackedSquare = document.querySelector(`#computer .row .gridsquare[data-x="${lastAttackedPos.x}"][data-y="${lastAttackedPos.y}"]`);
    const attackedShipObj = playerObj.getShipObject(lastAttackedPos.x, lastAttackedPos.y);

    switch (computerTurnResult) {
      case 'hit':
        attackedSquare.setAttribute('class', 'gridsquare hit');
        break;
      case false:
        console.log('gameover');
        break;
      case 'waterhit':
        attackedSquare.setAttribute('class', 'gridsquare waterhit');
        break;
      case 'sunk':
        this.onShipDestruct(attackedShipObj, '#computer');
        break;
      default:
        console.log('computerTurn defaulted');
    }
  }

  playerTurn(target, playerObj, computerObj) {
    playerObj.coordinateToAttack(Number(target.getAttribute('data-x')), Number(target.getAttribute('data-y')));

    switch (playerObj.attack(computerObj)) {
      case 'hit':
        target.setAttribute('class', 'gridsquare hit');
        return true;
      case false:
        return false;
      case 'waterhit':
        target.setAttribute('class', 'gridsquare waterhit');
        return true;
      case 'sunk':
        this.onShipDestruct(computerObj.getShipObject(target.getAttribute('data-x'), target.getAttribute('data-y')), '#player');
        return true;
      default:
        console.log('playerTurn defaulted');
    }
    return 'error';
  }

  addGameEventListeners(playerObj, computerObj) {
    const controller = new AbortController();

    const playerSquares = document.querySelectorAll('#player .row .gridsquare');

    playerSquares.forEach((square) => {
      square.addEventListener('click', (e) => {
        if (this.playerTurn(e.target, playerObj, computerObj)) {
          this.computerTurn(playerObj, computerObj);
        }
        if (!playerObj.shipsInPlay()) {
          this.onGameOver('#computer', '#player');
          this.#gameStatus.textContent = 'The computer wins!';
          controller.abort();
        }
        if (!computerObj.shipsInPlay()) {
          this.onGameOver('#player', '#computer');
          this.#gameStatus.textContent = 'You win!';
          controller.abort();
        }
      }, { signal: controller.signal });
    });
  }

  placeShips(playerObj, computerObj) {
    const abortHandler = new AbortController();
    this.#gameStatus.textContent = 'Place your ships.';
    const computerSquares = document.querySelectorAll('#computer .row .gridsquare');
    let orientation = true;
    const orientButton = document.createElement('button');
    orientButton.id = 'orientButton';
    orientButton.textContent = 'Change orientation';
    this.#pageContainer.appendChild(orientButton);
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
        if (playerObj.placeShip(
          clickedPosition.x,
          clickedPosition.y,
          orientation,
          playerObj.shipLengths[this.#placedShips],
        )) {
          this.placeShipOutline(orientation, playerObj, clickedPosition);

          computerObj.placeShip(computerObj.shipLengths[this.#placedShips]);

          this.#placedShips += 1;
          if (this.#placedShips === this.#numberOfShips) {
            this.#gameStatus.textContent = 'Game start - Destroy your opponent\'s ships to win!';
            orientButton.remove();
            abortHandler.abort();
            this.addGameEventListeners(playerObj, computerObj);
          }
        }
      }, { signal: abortHandler.signal });
      square.addEventListener('mouseover', (e) => this.toggleShipPreview(orientation, playerObj, e.target), { signal: abortHandler.signal });
      square.addEventListener('mouseout', (e) => this.toggleShipPreview(orientation, playerObj, e.target), { signal: abortHandler.signal });
    });
  }
}
