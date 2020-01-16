const Product = require("../models/product");
const Edit = require("../models/edit");

exports.getAddProduct = (req, res, next) => {
  //   res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    active: true,
    path: "/admin/add-product",
    admin: true,
    all: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.body.image;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(title, image, description, price);
  product.save();
  res.redirect("/admin/add-product");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  res.render("admin/edit-product", {
    product: product,
    pageTitle: "Edit product",
    editing: editMode,
    active: true,
    admin: true,
    all: false
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin products",
      path: "/admin/products",
      active: true,
      admin: true,
      all: false
    });
  });
};
exports.getEdit = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Edit product",
    path: "/admin/edit-product",
    active: true,
    admin: true,
    all: false
  });
};
