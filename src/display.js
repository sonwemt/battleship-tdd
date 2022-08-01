export default class BattleshipPage {
  #container;

  #gridContainer;

  #width;

  #height;

  constructor(container, width, height) {
    this.#container = document.getElementById(container);
    this.#width = width;
    this.#height = height;
  }

  createGrid(player) {
    this.#gridContainer = document.createElement('div');
    this.#gridContainer.setAttribute('class', `${player}`);
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
      this.#gridContainer.appendChild(row);
    }
    this.#container.appendChild(this.#gridContainer);
  }
}
