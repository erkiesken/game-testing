
class Product extends Tile {
  constructor(x, y, type) {
    super(x, y, type);
    this.visible = true;
  }

  take() {
    this.visible = false;
  }
}

const products = new TileMap();

products.add([
  new Product(2, 8, "apple"),
  new Product(4, 1, "apple"),
  new Product(10, 6, "banana"),
]);
