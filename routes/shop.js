const path = require("path");

const express = require("express");

const shopController = require("../controllers/products");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/product-details/:productId", shopController.getProduct);

router.post("/cart", shopController.postCart);

router.get("/products/delete");

router.get("/checkout", shopController.checkout);

router.get("/cart", shopController.getCart);

module.exports = router;
