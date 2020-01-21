const express = require("express");

const authControllers = require("../controllers/auth");

const router = express.Router();

router.get("/login", authControllers.getAuth);
router.post("/login", authControllers.postLogin);

router.get("/signup", authControllers.getSignup);
router.post("/signup", authControllers.postSignup);

router.post("/logout", authControllers.postLogout);

module.exports = router;