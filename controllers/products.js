const rootDir = require("../util/path");

const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/products",
      active: true,
      admin: false,
      all: false
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    res.render("shop/details", {
      product: product,
      pageTitle: "Product details",
      path: "/details",
      active: true,
      admin: false,
      all: false
    });
  });
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
  Product.fetchAll(products => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Main Page",
      path: "/",
      active: true,
      admin: true,
      all: true
    });
  });
};
