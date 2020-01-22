const Product = require("../models/product");
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

//It sends us to the adding product page
exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add product",
    active: true,
    path: "/admin/add-product",
    admin: true,
    all: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

//We can add some product that referes to some user by takin it it's ID and by parsing data from the form
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.body.image;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product({
    title: title,
    image: image,
    description: description,
    price: price,
    userId: req.user._id
  });

  //every time we can save some data to our DB we need to make promise on that by fireing save() fnction
  product
    .save()
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};

//Here we're having editmode that we retrive from hidden input
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  //params we can have by adding them to the addres of the page for instance /edit-product:productId
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        admin: true,
        editing: editMode,
        product: product,
        all: false,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .populate("userId")
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin products",
        path: "/admin/products",
        active: true,
        admin: true,
        all: false,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

//mongose is great by taking us some extra functions as having a product by ID
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImage = req.body.image;
  const updatedDescription = req.body.description;
  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.image = updatedImage;
      product.description = updatedDescription;
      return product.save();
    })
    .then(() => res.redirect("/admin/products"))
    .catch(err => console.log(err));
};

//Here we can delete some data from our database by searching them by ID. We need to remember that all mongoose finctions are promises.
exports.postDeleteProduct = (req, res, err) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};
