const rootDir = require("../util/path");

const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/products",
      active: true
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
    active: true
  });
};

exports.checkout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout page",
    path: "/checkout",
    active: true
  });
};
exports.products = (req, res, next) => {
  res.render("shop/products", {
    pageTitle: "All products",
    path: "/products",
    active: true
  });
};

exports.getIndex = (req, res, next) => {
  res.render("shop/index", {
    pageTitle: "Index",
    path: "/",
    active: true
  });
};
