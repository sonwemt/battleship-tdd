export default class Ship {
  #hull = [];

  constructor(length) {
    this.#hull = Array(length).fill(false);
  }

  get hull() {
    return this.#hull;
  }

  hit(x, y, index) {
    if (!this.#hull[index]) {
      this.#hull[index] = { x, y };
    } else {
      return false;
    }
    return this;
  }

  isSunk() {
    return (this.#hull.find((section) => section === false) === undefined);
  }
}
