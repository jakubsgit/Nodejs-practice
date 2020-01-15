const rootDir = require("../util/path");

const products = [];

exports.getAddProduct = (req, res, next) => {
  //   res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("add-product", { pageTitle: "Add product" });
};

exports.addNewProduct = (req, res, next) => {
  if (req.body.title === "") {
    res.redirect("/");
  } else products.push({ title: req.body.title });
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
};

exports.products = products;
