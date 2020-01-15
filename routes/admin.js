const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const productsController = require("../controllers/products");

// we can get another path to name them in Node.js file
router.get("/add-product", productsController.getAddProduct);
router.post("/", productsController.addNewProduct);

module.exports = router;
