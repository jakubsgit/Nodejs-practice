const express = require("express");

const authControllers = require("../controllers/auth");

const router = express.Router();

router.get("/login", authControllers.getAuth);
router.post("/login", authControllers.postLogin);

router.get("/signup", authControllers.getSignup);
router.post("/signup", authControllers.postSignup);

router.get("/reset", authControllers.getReset);
router.post("/reset", authControllers.postReset);

router.get("/reset:token", authControllers.getPasswordChange);
router.post("/new-password", authControllers.postPasswordChange);

router.post("/logout", authControllers.postLogout);

module.exports = router;
