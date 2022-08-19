import Player from './player';

export default class PlayerAI extends Player {
  attackedGrids = [];

  foundShip = false;

  rolledGrids;

  numberOfSquares = this.width * this.height;

  firstMove = true;

  rollCoordinateX(min = 0, max = this.width) {
    this.x = Math.floor(Math.random() * (max - min) + min);
  }

  rollCoordinateY(min = 0, max = this.height) {
    this.y = Math.floor(Math.random() * (max - min) + min);
  }

  checkPlacement(x, y) {
    return this.attackedGrids.find((grid) => grid.x === x && grid.y === y);
  }

  rollCoordinates() {
    if (this.numberOfSquares <= this.attackedGrids.length) {
      return false;
    }
    this.rollCoordinateX();
    this.rollCoordinateY();
    while (this.checkPlacement(this.x, this.y)) {
      this.rollCoordinateX();
      this.rollCoordinateY();
    }
    return true;
  }

  rollHor() {
    if (this.foundShip.east) {
      this.x -= 1;
      console.log('west');
      return;
    } if (this.foundShip.west) {
      this.x += 1;
      console.log('east');
      return;
    }
    const diceRoll1 = Math.floor(Math.random() * 2);
    if (diceRoll1 === 0 || this.foundShip.west) {
      this.x -= 1;
      console.log('west');
    } else if (diceRoll1 === 1 || this.foundShip.east) {
      this.x += 1;
      console.log('east');
    }
  }

  rollVert() {
    if (this.foundShip.north) {
      this.y -= 1;
      console.log('south');
      return;
    } if (this.foundShip.south) {
      this.y += 1;
      console.log('north');
      return;
    }
    const diceRoll2 = Math.floor(Math.random() * 2);
    if (diceRoll2 === 0 || this.foundShip.north) {
      this.y -= 1;
      console.log('south');
    } else if (diceRoll2 === 1 || this.foundShip.south) {
      this.y += 1;
      console.log('north');
    }
  }

  rollAdjacentPos() {
    const diceRoll = Math.floor(Math.random() * 2);
    if (diceRoll === 0 || (this.foundShip.north && this.foundShip.south)) {
      this.rollHor();
    } else if (diceRoll === 1 || (this.foundShip.west && this.foundShip.east)) {
      this.rollVert();
    }
    while (this.checkPlacement(this.x, this.y)) {
      this.rollAdjacentPos();
    }
  }

  followDirection() {
    console.log('follow');
    if (this.foundShip.direction === 'east') {
      this.x += 1;
    } else if (this.foundShip.direction === 'west') {
      this.x -= 1;
    } else if (this.foundShip.direction === 'north') {
      this.y += 1;
    } else if (this.foundShip.direction === 'south') {
      this.y -= 1;
    }
  }

  setDirection() {
    this.checkDirections();
    if (this.foundShip.position.length < 2 && !this.foundShip.direction) {
      this.x = this.foundShip.position[0].x;
      this.y = this.foundShip.position[0].y;
      return;
    } if (this.foundShip.position.length < 2 && this.foundShip.direction) {
      this.foundShip.direction = false;
      return;
    }
    const { position } = this.foundShip;
    if (!this.foundShip.direction) {
      if (position[position.length - 2].x < position[position.length - 1].x) {
        this.foundShip.direction = 'east';
      } else if (position[position.length - 2].x > position[position.length - 1].x) {
        this.foundShip.direction = 'west';
      } else if (position[position.length - 2].y < position[position.length - 1].y) {
        this.foundShip.direction = 'north';
      } else if (position[position.length - 2].y > position[position.length - 1].y) {
        this.foundShip.direction = 'south';
      }
    } if (this.foundShip.direction === 'west' && this.foundShip.west) {
      this.foundShip.direction = 'east';
      if (this.foundShip.east) {
        this.foundShip.direction = false;
        this.x = this.foundShip.position[0].x;
        this.y = this.lastY;
      }
    } else if (this.foundShip.direction === 'east' && this.foundShip.east) {
      this.foundShip.direction = 'west';
      if (this.foundShip.west) {
        this.foundShip.direction = false;
        this.x = this.foundShip.position[0].x;
        this.y = this.lastY;
      }
    } else if (this.foundShip.direction === 'south' && this.foundShip.south) {
      this.foundShip.direction = 'north';
      if (this.foundShip.north) {
        this.foundShip.direction = false;
        this.y = this.foundShip.position[0].y;
        this.x = this.lastX;
      }
    } else if (this.foundShip.direction === 'north' && this.foundShip.north) {
      this.foundShip.direction = 'south';
      if (this.foundShip.south) {
        this.foundShip.direction = false;
        this.x = this.foundShip.position[0].x;
        this.y = this.foundShip.position[0].y;
      }
    }
    this.checkDirections();
  }

  targetShip() {
    if (this.foundShip.direction) {
      this.followDirection();
      return;
    }
    this.rollAdjacentPos();
  }

  checkDirections() {
    if (this.checkPlacement(this.x + 1, this.y) || this.x >= this.width) {
      this.foundShip.east = true;
    } else {
      this.foundShip.east = false;
    }
    if (this.checkPlacement(this.x - 1, this.y) || this.x <= 0) {
      this.foundShip.west = true;
    } else {
      this.foundShip.west = false;
    }
    if (this.checkPlacement(this.x, this.y + 1) || this.y >= this.height) {
      this.foundShip.north = true;
    } else {
      this.foundShip.north = false;
    }
    if (this.checkPlacement(this.x, this.y - 1) || this.y <= 0) {
      this.foundShip.south = true;
    } else {
      this.foundShip.south = false;
    }
  }

  trackHits(player) {
    const result = this.lastResult;
    if (result === 'waterhit' && !this.foundShip) {
      return;
    }

    if (result === 'sunk') {
      const sunkenShip = player.getShipObject(this.lastX, this.lastY);
      console.log('sunken1', sunkenShip.length);
      console.log('position.length1', this.foundShip.position.length);
      console.log('amount1', this.foundShip.amount);
      if (sunkenShip.length >= this.foundShip.position.length + 1) {
        this.foundShip = false;
        return;
      }
      for (let i = this.foundShip.position.length; i > 0; i -= 1) {
        const pos = this.foundShip.position[i - 1];
        const hitShip = player.getShipObject(pos.x, pos.y);
        if (hitShip.isSunk()) {
          console.log('x: ', pos.x, 'y: ', pos.y);
          this.foundShip.position.splice(i - 1, 1);
        }
      }
      this.foundShip.amount = this.foundShip.position.length - 1;
      console.log('fs len 2', this.foundShip.position.length);
      console.log('amount 2', this.foundShip.amount);
      this.x = this.foundShip.position[this.foundShip.amount].x;
      this.y = this.foundShip.position[this.foundShip.amount].y;
      this.setDirection();
      return;
    }

    if (result === 'hit' && !this.foundShip) {
      this.foundShip = {
        amount: 0,
        direction: false,
        position: [],
      };
      this.foundShip.position = [{ x: this.lastX, y: this.lastY }];
      console.log('?x;', this.foundShip.position[0].x, 'y: ', this.foundShip.position[0].y);
      return;
    }
    if (result === 'hit') {
      this.foundShip.position.push({ x: this.lastX, y: this.lastY });
      console.log('?x;', this.foundShip.position[this.foundShip.position.length - 1].x, 'y: ', this.foundShip.position[this.foundShip.position.length - 1].y);
      this.foundShip.amount += 1;
      this.setDirection();
      return;
    }
    if (result === 'waterhit') {
      if (this.foundShip.direction === 'north') {
        this.y = this.foundShip.position[0].y;
        this.x = this.lastX;
      } else if (this.foundShip.direction === 'east') {
        this.x = this.foundShip.position[0].x;
        this.y = this.lastY;
      } else if (this.foundShip.direction === 'south') {
        this.x = this.lastX;
        this.y = this.foundShip.position[0].y;
      } else if (this.foundShip.direction === 'west') {
        this.x = this.foundShip.position[0].x;
        this.y = this.lastY;
      } else if (!this.foundShip.direction) {
        this.x = this.foundShip.position[0].x;
        this.y = this.foundShip.position[0].y;
      }
      this.setDirection();
    }
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
  }

  attack(player) {
    if (this.firstMove) {
      this.firstMove = false;
      const rollCheck = this.rollCoordinates();
      if (!rollCheck) {
        return false;
      }
    } else {
      this.trackHits(player);
      if (this.foundShip) {
        this.targetShip();
      } else {
        const rollCheck = this.rollCoordinates();
        if (!rollCheck) {
          return false;
        }
      }
    }
    const result = super.attack(player);
    this.attackedGrids.push({ x: this.x, y: this.y, result });
    console.log(this.x, this.y);
    return result;
  }

  get lastAttackedGrid() {
    return this.attackedGrids[this.attackedGrids.length - 1];
  }

  get lastX() {
    return this.attackedGrids[this.attackedGrids.length - 1].x;
  }

  get lastY() {
    return this.attackedGrids[this.attackedGrids.length - 1].y;
  }

  get lastResult() {
    return this.attackedGrids[this.attackedGrids.length - 1].result;
  }
}
