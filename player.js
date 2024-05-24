

class Hero {
  constructor(x, y, selector) {
    this.pos = new Pos(x, y);
    this.speed = 0.05;
    this.setTarget(x, y);
    this.element = document.querySelector(selector);
  }

  toString() {
    return `Player at ${this.pos.key}, current target ${this.target.key}`;
  }

  get roundedPos() {
    return new Pos(Math.round(this.pos.x), Math.round(this.pos.y));
  }

  setTarget(x, y) {
    this.target = new Pos(x, y);
  }

  move() {
    if (this.pos.x != this.target.x) {
      this.pos.x += this.speed * Math.sign(this.target.x - this.pos.x);
      // If very close, round to target
      if (Math.abs(this.pos.x - this.target.x) < this.speed) {
        this.pos.x = this.target.x;
      }
    }
    if (this.pos.y != this.target.y) {
      this.pos.y += this.speed * Math.sign(this.target.y - this.pos.y);
      // If very close, round to target
      if (Math.abs(this.pos.y - this.target.y) < this.speed) {
        this.pos.y = this.target.y;
      }
    }
  }
}

const player = new Hero(1, 1, "#hero");
