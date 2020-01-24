const rootDir = require("../util/path");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const stripe = require("stripe")("test_token");

const Product = require("../models/product");
const Order = require("../models/order");
const ITEMS_PER_PAGE = 2;

//find() function alows us to get all data from certain collection in our DB
exports.getProducts = (req, res, next) => {
  const page = req.query.page;
  let totalItems;
  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render("shop/shop", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        active: true,
        admin: false,
        all: false,
        isAuthenticated: req.session.isLoggedIn,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => console.log(err));
};

//Every time we receive prodId in the params. We need to remember about that.
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product =>
      res.render("shop/details", {
        product: product,
        pageTitle: "Product details",
        path: "/details",
        active: true,
        admin: false,
        all: false,
        isAuthenticated: req.session.isLoggedIn
      })
    )
    .catch(err => console.log(err));
};

//if we want to add some product to the cart we need to push him to the function taht we created in user models addToCart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
    })
    .then(result => {
      res.redirect("/products");
    }); // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then(products => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findByPk(prodId);
  //   })
  //   .then(product => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity }
  //     });
  //   })
};

//in user by making methods in models we can have them
exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteFromCart(prodId)
    .then(result => {
      res.redirect("/cart");
    })

    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      //By populating some data from users collection we can have the data
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
        active: true,
        admin: false,
        all: false
      });
    })
    .catch(err => {});
};

exports.getIndex = (req, res, next) => {
  res.render("shop/index", {
    prods: "",
    pageTitle: "Main Page",
    path: "/",
    active: true,
    admin: true,
    all: true,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postCreateOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(p => {
        return {
          quantity: p.quantity,
          //MongoDB treats _doc like the method to have all data out of certain product
          productData: { ...p.productId._doc }
        };
      });
      //If we want to have Orders collection in our db we need to add all porducts that we've made previuously and push them to the collection
      const order = new Order({
        user: {
          name: user.name,
          userId: user._id
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => res.redirect("/orders"))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user })
    .then(orders => {
      const ord = orders.map(order => {
        return order.products;
      });
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        active: true,
        admin: false,
        all: false,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  let products;
  const orderId = req.params.orderId;
  console.log(orderId);
  Order.find({ _id: orderId })
    .then(orders => {
      products = orders.map(order => {
        return order.products[0];
      });
      console.log(products);
      //   return stripe.session.create({
      //     payment_method_types: ["card"],
      //     line_items: products.map(p => {
      //       return {
      //         name: p.productData.title,
      //         description: p.productData.description,
      //         amount: p.productData.price * 100,
      //         currency: "usd",
      //         quantity: p.quantity
      //       };
      //     }),
      //     success_url: "",
      //     cancel_url: ""
      //   });
      // })
      // .then(session => {
      res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout page",
        active: true,
        products: products,
        admin: false,
        all: false,
        isAuthenticated: req.session.isLoggedIn,
        sessionId: session.id
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getInvoice = (req, res, next) => {
  const user = req.user;
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error("The invoice of this order can not be executed"));
      }
      if (order.user.userId.toString() !== user._id.toString()) {
        return next(new Error("This invoice does not belong to the user"));
      }
      const fileName = `invoice.pdf`;
      const invoicePath = path.join("data", "invoices", fileName);
      const pdfDoc = new PDFDocument();
      res.setHeader("ContentType", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + fileName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      res.setHeader("ContentType", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   'inline; filename="' + fileName + '"'
      // );
      pdfDoc.text("Hello word");
      pdfDoc.end();
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("ContentType", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   'inline; filename="' + fileName + '"'
      // );
      // file.pipe(res);
    })
    .catch(err => {
      console.log(err);
    });

  // fs.readFile(invoicePath, (err, data) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.setHeader("ContentType", "application/pdf");
  //   res.setHeader("Content-Disposition", 'inline; filename="' + fileName + '"');
  //   res.send(data);
  // });
};
