const TILE_SIZE = 50;

class Game {
  constructor(player, tiles, products, enemies, input) {
    // state
    this.running = false;

    // other data
    this.player = player;
    this.tileMap = tiles;
    this.input = input;
    this.productMap = products;
    this.enemies = enemies;

    this.element = document.querySelector("#grid");

    this.tick = this.tick.bind(this);

    this.renderTiles();
    this.renderPlayer();
    this.renderProducts();
  }

  start() {
    this.running = true;
    window.requestAnimationFrame(this.tick.bind(this));
    this.input.addEventListener("moving", this.movePlayer.bind(this));
  }

  stop() {
    this.running = false;
    this.input.removeEventListener("moving", this.movePlayer);
  }

  tick() {
    this.player.move();
    this.renderPlayer();
    // console.debug(player.toString());

    for (let enemy of this.enemies) {
      enemy.move();
      console.log(enemy.toString());
    }

    if (this.running) {
      window.requestAnimationFrame(this.tick);
    }
  }

  movePlayer(ev) {
    const dir = ev.detail;

    if (dir == "none") {
      return;
    }

    const curr = this.player.roundedPos;
    const target = curr.offsetPos(dir);

    if (this.tileMap.isWalkable(target.key)) {
      console.log(`new target ${target}`);
      this.player.setTarget(target.x, target.y);
    } else {
      console.log(`can not move from ${curr} to ${target}`);
    }
  }

  renderTiles() {
    for (let tile of this.tileMap.items.values()) {
      const div = document.createElement("div");
      div.classList.add("tile");
      div.classList.add(tile.className);
      div.style.top = `${tile.y * TILE_SIZE}px`;
      div.style.left = `${tile.x * TILE_SIZE}px`;
      this.element.appendChild(div);
    }
  }

  renderPlayer() {
    const pos = this.player.pos;
    const div = this.player.element;
    div.style.top = `${pos.y * TILE_SIZE}px`;
    div.style.left = `${pos.x * TILE_SIZE}px`;
  }


  renderProducts() {
    for (let tile of this.productMap.items.values()) {
      const div = document.createElement("div");
      div.classList.add("tile");
      div.classList.add("product");
      div.classList.add(tile.className);
      div.style.top = `${tile.y * TILE_SIZE}px`;
      div.style.left = `${tile.x * TILE_SIZE}px`;
      this.element.appendChild(div);
    }
  }
}

const enemies = [enemy1, enemy2];

const game = new Game(player, tiles, products, enemies, input);

game.start();
