import Player from '../player';
import PlayerAI from '../playerai';

const aiPlayer1 = new PlayerAI(10, 10);

test('Computer randomly places ships in any available grids', () => {
  for (let i = 0; i < 10; i += 1) {
    aiPlayer1.placeShip(3);
    console.debug(aiPlayer1.lastPlacedShipGrid);
  }
});

const aiPlayer = new PlayerAI(2, 2);
const player = new Player(2, 2);

test('ai plays random coords and remembers coords placed', () => {
  expect(aiPlayer.attack(player)).toBe('hit');
  console.debug('posX: ', aiPlayer.x);
  console.debug('posY: ', aiPlayer.y);
  expect(aiPlayer.attack(player)).toBe('hit');
  console.debug('posX: ', aiPlayer.x);
  console.debug('posY: ', aiPlayer.y);
  expect(aiPlayer.attack(player)).toBe('hit');
  console.debug('posX: ', aiPlayer.x);
  console.debug('posY: ', aiPlayer.y);
  expect(aiPlayer.attack(player)).toBe('hit');
  console.debug('posX: ', aiPlayer.x);
  console.debug('posY: ', aiPlayer.y);
  expect(aiPlayer.attack(player)).toBe(false);
});
