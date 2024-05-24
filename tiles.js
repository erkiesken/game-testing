
class Pos {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `Pos[${this.key}]`;
  }

  get key() {
    return `${this.x}:${this.y}`;
  }

  offsetPos(dir) {
    if (dir == "up") {
      return new Pos(this.x, this.y - 1);
    } else if (dir == "down") {
      return new Pos(this.x, this.y + 1);
    } else if (dir == "left") {
      return new Pos(this.x - 1, this.y);
    } else if (dir == "right") {
      return new Pos(this.x + 1, this.y);
    }
    return this;
  }
}

const tileTypes = {
  "#": "outerwall",
  ".": "walkway",
};

class Tile extends Pos {
  constructor(x, y, type) {
    super(x, y);
    this.type = type;
    this.className = tileTypes[type] || type;
  }
}

class TileMap {
  constructor(data) {
    this.items = new Map();
    if (data) {
      this.parse(data);
    }
  }

  add(tiles) {
    for (const tile of tiles) {
      this.items.set(tile.key, tile);
    }
  }

  isWalkable(key) {
    return this.items.has(key) && this.items.get(key).type == ".";
  }

  parse(data) {
    const lines = data.split("\n");
    const tiles = [];
    for (let y = 0; y < lines.length; y++) {
      const line = lines[y].split("");
      for (let x = 0; x < line.length; x++) {
        const t = line[x];
        tiles.push(new Tile(x, y, t));
      }
    }
    this.add(tiles);
  }
}


const tiles = new TileMap(`
############
#....##....#
#.##....##.#
#....##....#
###.###.#.##
###.###.#.##
#....##....#
#.##.##.##.#
#..........#
############
`.trim());
