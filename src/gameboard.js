import Ship from './ship';

export default class Gameboard {
  #boardWidth;

  #boardHeight;

  #ships = [];

  sunkShips = [];

  occupiedPositions;

  constructor(width = 10, height = 10) {
    this.occupiedPositions = Array.from(
      Array(width),
      () => new Array(height).fill(false),
    );
    this.#boardWidth = width;
    this.#boardHeight = height;
  }

  get width() {
    return this.#boardWidth;
  }

  get height() {
    return this.#boardHeight;
  }

  getShipObject(x, y) {
    return this.occupiedPositions[x][y].ship;
  }

  placementValid(x, y, alignedWithX, length = 1) {
    for (let i = 0; i < length; i += 1) {
      if (alignedWithX) {
        if (((x + i) >= this.width) && (alignedWithX)) {
          return false;
        }
        if ((this.occupiedPositions[x + i][y]) && (alignedWithX)) {
          return false;
        }
      } else {
        if (((y + i) >= this.height)) {
          return false;
        }
        if ((this.occupiedPositions[x][y + i])) {
          return false;
        }
      }
    }
    return true;
  }

  placeShip(x, y, alignedWithX, length) {
    const shipObject = new Ship(length);
    if (!this.placementValid(x, y, alignedWithX, length)) {
      return false;
    }
    for (let i = 0; i < length; i += 1) {
      if (alignedWithX) {
        this.occupiedPositions[x + i][y] = ({
          ship: shipObject,
          hullSection: i,
        });
      } else {
        this.occupiedPositions[x][y + i] = ({
          ship: shipObject,
          hullSection: i,
        });
      }
    }
    this.#ships.push(shipObject);
    return true;
  }

  receiveHit(x, y) {
    const coordinateValue = this.occupiedPositions[x][y];
    if (coordinateValue.ship !== undefined) {
      coordinateValue.ship.hit(x, y, coordinateValue.hullSection);
      if (this.occupiedPositions[x][y].ship.isSunk()) {
        this.sunkShips.push(this.#ships.splice(this.occupiedPositions[x][y].ship, 1));
        return 'sunk';
      }
      return true;
    }
    if (coordinateValue) {
      return false;
    }
    this.occupiedPositions[x][y] = 'hit';
    return 'hit';
  }

  shipsInPlay() {
    return this.#ships.length > 0;
  }
}
