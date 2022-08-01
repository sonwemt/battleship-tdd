import Player from './player';

export default class PlayerAI extends Player {
  #lastPlacedShipGrid;

  attackedGrids = [];

  numberOfSquares = this.width * this.height;

  get lastPlacedShipGrid() {
    return this.#lastPlacedShipGrid;
  }

  rollCoordinateX() {
    this.x = Math.floor(Math.random() * this.width);
  }

  rollCoordinateY() {
    this.y = Math.floor(Math.random() * this.height);
  }

  rollCoordinates() {
    if (this.numberOfSquares <= this.attackedGrids.length) {
      return false;
    }
    this.rollCoordinateX();
    this.rollCoordinateY();
    while (this.attackedGrids.find((grid) => grid.x === this.x && grid.y === this.y)) {
      this.rollCoordinateX();
      this.rollCoordinateY();
    }
    return true;
  }

  placeShip(length) {
    let orientation;

    if (Math.floor(Math.random() * 2) === 1) {
      orientation = true;
    } else {
      orientation = false;
    }
    this.rollCoordinates();
    while (!super.placeShip(this.x, this.y, orientation, length)) {
      this.rollCoordinates();
    }
    this.#lastPlacedShipGrid = `x:${this.x} y:${this.y}`;
  }

  attack(player) {
    if (!this.rollCoordinates()) {
      return false;
    }
    this.attackedGrids.push({ x: this.x, y: this.y });
    return super.attack(player);
  }

  get lastAttackedGrid() {
    return this.attackedGrids[this.attackedGrids.length - 1];
  }
}
