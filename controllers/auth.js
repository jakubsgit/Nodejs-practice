const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getAuth = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  //   const isLoggedIn =
  //     req
  //       .get("Cookie")
  //       .split(";")[0]
  //       .trim()
  //       .split("=")[1] == "true";
  console.log(req.flash("error"));
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    admin: true,
    all: false,
    errorMessage: message
  });
};

//Here in login we can have our login data in requests body and check them if they match our cyrrent data of the user
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      //We need to transfer the user to login age if he doesn't exist
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      console.log(user);
      //if exists we need to compare his password by encrypting it with bcrypt
      bcrypt
        .compare(password, user.password)
        //it returns us promise eighter with false or true response
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch(err => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    admin: true,
    all: false
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        req.redirect("/signup");
      }
      //every time if we return something in such a functions we need to proceed the promise. then()
      return bcrypt.hash(password, 12);
    })
    //here we have our crypted password and we can connect it to the certain user
    .then(hashedPassword => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => {
      console.log(err);
    });
};

//If we work on sessions we need to remember to ad some action to destroy it. In such a case is logout action that delete every session that was running
exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
