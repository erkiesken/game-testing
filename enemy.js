

class Enemy {
  #targets = [];

  constructor(x, y, selector) {
    this.pos = new Pos(x, y);
    this.speed = 0.05;
    this.setTarget(x, y);
    this.element = document.querySelector(selector);
  }

  toString() {
    return `Enemy at ${this.pos.key}, current target ${this.target.key}`;
  }

  setTarget(x, y) {
    this.target = new Pos(x, y);
  }

  set targets(value) {
    this.#targets = value;
    this.setTarget(...value[0]);
  }

  render() {
    this.element.style.top = `${this.pos.y * TILE_SIZE}px`;
    this.element.style.left = `${this.pos.x * TILE_SIZE}px`;
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
    if (this.pos.x == this.target.x && this.pos.y == this.target.y) {
      // switch to next target, moving current to end
      const curr = this.#targets.shift();
      this.targets = [...this.#targets, curr];
    }
  }
}

const enemy1 = new Enemy(1, 1, "#enemy1");
enemy1.targets = [[1,1], [5,1], [5,5], [1,5]];

const enemy2 = new Enemy(5, 8, "#enemy2");
enemy2.targets = [[5,3], [5,12]];
