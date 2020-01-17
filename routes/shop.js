const path = require("path");

const express = require("express");

const shopController = require("../controllers/products");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/product-details/:productId", shopController.getProduct);

router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.postCartDeleteItem);

router.get("/products/delete");

router.get("/checkout", shopController.getCheckout);

router.get("/cart", shopController.getCart);

router.post("/create-order", shopController.postCreateOrder);

module.exports = router;
