const db = require("../util/database");

const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, image, description, price) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.image = image;
    this.description = description;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, price, image, description) VALUES (?, ?, ?, ?)",
      [this.title, this.price, this.image, this.description]
    );
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static deleteById(id) {}
};
