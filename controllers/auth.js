const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getAuth = (req, res, next) => {
  //   const isLoggedIn =
  //     req
  //       .get("Cookie")
  //       .split(";")[0]
  //       .trim()
  //       .split("=")[1] == "true";
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    admin: true,
    all: false,
    isAuthenticated: false
  });
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.redirect("/login");
      }
      console.log(user);
      bcrypt
        .compare(password, user.password)
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
    pageTitle: "SIgnup",
    path: "/signup",
    admin: true,
    all: false,
    isAuthenticated: false
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.redirect("/signup");
      }
      return bcrypt.hash(password, 12);
    })
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

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
