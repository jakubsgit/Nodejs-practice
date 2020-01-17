module.exports = class Edit {
  constructor() {}

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id == id);
      cb(product);
    });
  }
};
