const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  //   res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/add-product", {
    pageTitle: "Add product",
    active: true,
    path: "/admin/add-product"
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/shop", {
      prods: products,
      pageTitle: "Admin products",
      path: "/",
      active: true
    });
  });
};
