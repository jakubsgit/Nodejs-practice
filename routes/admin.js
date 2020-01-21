const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const adminController = require("../controllers/admin");

// we can get another path to name them in Node.js file
router.get("/admin/add-product", adminController.getAddProduct);
router.post("/admin/add-product", adminController.postAddProduct);
// router for page with admin products
router.get("/admin/products", adminController.getProducts);

router.get("/admin/edit-product/:productId", adminController.getEditProduct);
router.post("/admin/edit-product", adminController.postEditProduct);

router.post("/admin/delete-product", adminController.postDeleteProduct);

module.exports = router;
