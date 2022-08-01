import Ship from '../ship';

const testShip = new Ship(3);

test('isSunk should return true if all sections true(hit), false otherwise', () => {
  testShip.hit(0, 2, 0).hit(0, 2, 1);
  expect(testShip.isSunk()).toBe(false);
  testShip.hit(0, 3, 2);
  expect(testShip.isSunk()).toBe(true);
});
