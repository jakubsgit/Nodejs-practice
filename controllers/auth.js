const Product = require("../models/product");
const mongodb = require("mongodb");

exports.getAuth = (req, res, next) => {
  //   const isLoggedIn =
  //     req
  //       .get("Cookie")
  //       .split(";")[0]
  //       .trim()
  //       .split("=")[1] == "true";
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    admin: true,
    all: false,
    isAuthenticated: false
  });
};
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("5e26fdbf35265f9c076737aa")
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
