import Gameboard from '../gameboard';

const gameBoard = new Gameboard(10, 10);

test('placeShip returns false if placement overlaps', () => {
  expect(gameBoard.placeShip(1, 2, true, 3)).toBe(true);
  expect(gameBoard.placeShip(2, 2, true, 3)).toBe(false);
  expect(gameBoard.placeShip(3, 2, true, 3)).toBe(false);
  expect(gameBoard.placeShip(4, 2, true, 3)).toBe(true);
  expect(gameBoard.placeShip(5, 2, true, 3)).toBe(false);
  expect(gameBoard.placeShip(4, 2, true, 3)).toBe(false);
  expect(gameBoard.placeShip(2, 4, true, 3)).toBe(true);
});

test('placementValid returns false if ship out of bounds', () => {
  expect(gameBoard.placementValid(1, 9, true, 3)).toBe(true);
  expect(gameBoard.placementValid(2, 9, true, 3)).toBe(true);
  expect(gameBoard.placementValid(3, 9, true, 3)).toBe(true);
  expect(gameBoard.placementValid(4, 9, true, 3)).toBe(true);
  expect(gameBoard.placementValid(5, 9, true, 3)).toBe(true);
  expect(gameBoard.placementValid(6, 9, true, 3)).toBe(true);
  expect(gameBoard.placementValid(7, 9, true, 3)).toBe(true);
  expect(gameBoard.placementValid(8, 9, true, 3)).toBe(false);
  expect(gameBoard.placementValid(9, 9, true, 3)).toBe(false);
  expect(gameBoard.placementValid(9, 1, false, 3)).toBe(true);
  expect(gameBoard.placementValid(9, 2, false, 3)).toBe(true);
});

test('should return true if ship is hit, but not sunk', () => {
  expect(gameBoard.receiveHit(1, 2)).toBe(true);
  expect(gameBoard.receiveHit(2, 2)).toBe(true);
});

test('should return \'sunk\' if hit causes ship to sink', () => {
  gameBoard.receiveHit(1, 2);
  gameBoard.receiveHit(2, 2);
  expect(gameBoard.receiveHit(3, 2)).toBe('sunk');
});

test('should return \'hit\' if new hit on empty space', () => {
  expect(gameBoard.receiveHit(1, 1)).toBe('hit');
});

test('should return false if grid already hit', () => {
  gameBoard.receiveHit(1, 1);
  expect(gameBoard.receiveHit(1, 1)).toBe(false);
});

const gameBoard1 = new Gameboard();

test('shipsInPlay should return true if any ships remain alive', () => {
  gameBoard1.placeShip(1, 1, true, 4);
  gameBoard1.placeShip(5, 5, false, 3);
  gameBoard1.placeShip(5, 1, true, 4);
  gameBoard1.receiveHit(1, 1);
  gameBoard1.receiveHit(2, 1);
  gameBoard1.receiveHit(3, 1);
  // expect(gameBoard1.shipsInPlay()).toBe(3);
  expect(gameBoard1.receiveHit(4, 1)).toBe('sunk');
  // expect(gameBoard1.shipsInPlay()).toBe(2);
  expect(gameBoard1.receiveHit(5, 5)).toBe(true);
  expect(gameBoard1.receiveHit(5, 6)).toBe(true);
  expect(gameBoard1.receiveHit(5, 7)).toBe('sunk');
  // expect(gameBoard1.shipsInPlay()).toBe(1);
  expect(gameBoard1.receiveHit(5, 1)).toBe(true);
  expect(gameBoard1.receiveHit(6, 1)).toBe(true);
  expect(gameBoard1.receiveHit(7, 1)).toBe(true);
  expect(gameBoard1.receiveHit(8, 1)).toBe('sunk');
  expect(gameBoard1.shipsInPlay()).toBe(false);
});

const gameBoard2 = new Gameboard(5, 8);
test('gameboard width and height getters', () => {
  expect(gameBoard1.width).toBe(10);
  expect(gameBoard1.height).toBe(10);

  expect(gameBoard2.width).toBe(5);
  expect(gameBoard2.height).toBe(8);
});
