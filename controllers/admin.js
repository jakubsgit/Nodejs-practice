const Product = require("../models/product");
const mongodb = require("mongodb");

const deleteFile = require("../util/file").deleteFile;
const ObjectId = mongodb.ObjectId;

//It sends us to the adding product page
exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add product",
    active: true,
    path: "/admin/add-product",
    admin: true,
    all: false,
    isAuthenticated: req.session.isLoggedIn,
    errorText: [],
    input: {
      title: "",
      description: "",
      price: ""
    }
  });
};

//We can add some product that referes to some user by takin it it's ID and by parsing data from the form
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  //we can get some file through multer in request and maka constant of it
  const imageInput = req.file;
  const description = req.body.description;
  const price = req.body.price;
  if (!imageInput) {
    res.render("admin/add-product", {
      pageTitle: "Add product",
      active: true,
      path: "/admin/add-product",
      admin: true,
      all: false,
      isAuthenticated: req.session.isLoggedIn,
      errorText: "The file was not upload correctly or it does not exist",
      input: {
        title: title,
        description: description,
        price: price
      }
    });
  }
  const image = imageInput.path;
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
      const error = err;
      error.httpStatuCode = 500;
      return next(error);
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
    .catch(err => {
      console.log(err);
      const error = err;
      error.httpStatuCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  let message = req.flash("editMessage");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  Product.find({ userId: req.user._id })
    .populate("userId")
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin products",
        path: "/admin/products",
        active: true,
        admin: true,
        all: false,
        isAuthenticated: req.session.isLoggedIn,
        message: message
      });
    })
    .catch(err => {
      console.log(err);
      const error = err;
      error.httpStatuCode = 500;
      return next(error);
    });
};

//mongose is great by taking us some extra functions as having a product by ID
exports.postEditProduct = (req, res, next) => {
  const user = req.user;
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDescription = req.body.description;
  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== user._id.toString()) {
        req.flash("editMessage", "You can't edit this product");
        return res.redirect("/admin/products");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      if (image) {
        product.image = image.path;
      }
      product.description = updatedDescription;
      return product.save();
    })
    .then(() => res.redirect("/admin/products"))
    .catch(err => {
      console.log(err);
      const error = err;
      error.httpStatuCode = 500;
      return next(error);
    });
};

//Here we can delete some data from our database by searching them by ID. We need to remember that all mongoose finctions are promises.
exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findOne({ _id: prodId, userId: req.user._id })
    .then(prod => {
      Product.deleteOne(prod)
        .then(result => {
          deleteFile(prod.image);
          console.log(prod);
          res.status(200).json({ message: "Seccess!" });
        })
        .res.status(500)
        .json();
    })
    .catch(err => console.log(err));
};
