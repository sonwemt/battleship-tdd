import Gameboard from './gameboard';

export default class Player extends Gameboard {
  #posX;

  #posY;

  attack(player) {
    return player.receiveHit(this.x, this.y);
  }

  set x(x) {
    this.#posX = x;
  }

  get x() {
    return this.#posX;
  }

  set y(y) {
    this.#posY = y;
  }

  get y() {
    return this.#posY;
  }

  coordinateToAttack(x, y) {
    this.#posX = x;
    this.#posY = y;
  }
}
