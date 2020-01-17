const rootDir = require("../util/path");

const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/shop", {
        prods: rows,
        pageTitle: "Shop",
        path: "/products",
        active: true,
        admin: false,
        all: false
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product]) => {
      res.render("shop/details", {
        product: product[0],
        pageTitle: "Product details",
        path: "/details",
        active: true,
        admin: false,
        all: false
      });
    })
    .catch(err => console.log(err));
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
        active: true,
        admin: false,
        all: false
      });
    });
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout page",
    path: "/checkout",
    active: true,
    admin: false,
    all: false
  });
};
exports.products = (req, res, next) => {
  res.render("shop/products", {
    pageTitle: "All products",
    path: "/products",
    active: true,
    admin: false,
    all: false
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Main Page",
        path: "/",
        active: true,
        admin: true,
        all: true
      });
    })
    .catch(err => console.log(err));
};
