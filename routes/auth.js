const { check, body } = require("express-validator");
const User = require("../models/user");

const express = require("express");

const authControllers = require("../controllers/auth");

const router = express.Router();

router.get("/login", authControllers.getAuth);
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .normalizeEmail()
      .custom(value => {
        //We can create Async function to get our user from data base and check if it already exists
        return User.findOne({ email: value }).then(user => {
          //We need to transfer the user to login age if he doesn't exist
          if (!user) {
            return Promise.reject(`${value} nie jest prawidłowym mailem`);
          }
        });
      }),
    body("password").trim()
  ],
  authControllers.postLogin
);

router.get("/signup", authControllers.getSignup);

//we can add validation from express-validator
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .normalizeEmail()
      .custom(value => {
        //We can create Async function to get our user from data base and check if it already exists
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject("Email jest ju zajęty");
          }
          //every time if we return something in such a functions we need to proceed the promise. then()
        });
      }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      })
      .trim()
  ],
  authControllers.postSignup
);

router.get("/reset", authControllers.getReset);
router.post("/reset", authControllers.postReset);

router.get("/reset:token", authControllers.getPasswordChange);
router.post("/new-password", authControllers.postPasswordChange);

router.post("/logout", authControllers.postLogout);

module.exports = router;
