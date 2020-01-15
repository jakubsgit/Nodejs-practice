const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const products = [];

// we can get another path to name them in Node.js file
router.get("/add-product", (req, res, next) => {
  //   res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("add-product", { pageTitle: "Add product" });
});

router.post("/", (req, res, next) => {
  if (req.body.title === "") {
    res.redirect("/");
  } else products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
