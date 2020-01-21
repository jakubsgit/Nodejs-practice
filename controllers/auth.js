const Product = require("../models/product");
const mongodb = require("mongodb");

exports.getAuth = (req, res, next) => {
  const isLoggedIn =
    req
      .get("Cookie")
      .split(";")[0]
      .trim()
      .split("=")[1] == "true";
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    admin: true,
    all: false,
    isAuthenticated: isLoggedIn
  });
};
exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
