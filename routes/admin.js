const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const adminController = require("../controllers/admin");

const isAuth = require("../middleware/is-auth");

// we can get another path to name them in Node.js file
router.get("/admin/add-product", isAuth, adminController.getAddProduct);
router.post("/admin/add-product", isAuth, adminController.postAddProduct);
// router for page with admin products
router.get("/admin/products", isAuth, adminController.getProducts);

router.get(
  "/admin/edit-product/:productId",
  isAuth,
  adminController.getEditProduct
);
router.post("/admin/edit-product", isAuth, adminController.postEditProduct);

router.delete(
  "/admin/delete-product/:productId",
  isAuth,
  adminController.deleteProduct
);

module.exports = router;
