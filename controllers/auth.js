require("dotenv").config();
const crypto = require("crypto");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

//for nodemailer we need to create transporter. For this example we can use great package taht is nodemailer-sendgrid-transport.
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: `${process.env.SENDGRID_API}`
    }
  })
);

exports.getAuth = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  if (req.user) {
    return res.redirect("/");
  } else {
    return res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      admin: true,
      all: false,
      errorMessage: message
    });
  }
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
      return transporter.sendMail({
        to: "jakubantczak.info@gmail.com",
        from: "shoppage@node.pl",
        subject: "You have succeeded signed up!",
        html: `<h3>Great you did it ${name}! Your mail is ${email} and your password is ${password}. Please hide it from everyone</h3>`
      });
    })
    .catch(err => {
      console.log(err);
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

exports.getReset = (req, res, next) => {
  let message = req.flash("resetMessage");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/resetPass", {
    pageTitle: "Reset your password",
    path: "/reset",
    admin: true,
    all: false,
    message: message
  });
};

//Here is the method to reset our password
exports.postReset = (req, res, next) => {
  //with crypto.randomBytes we can create token that we will be using thorugh out all reseting stages
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect("/login");
    }
    //we need to convert aour token to hex build
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash(
            "resetMessage",
            "We did not find your email in our data base, try once again or signup"
          );
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        req.flash(
          "resetMessage",
          "Check you mailbox to procceed with password changing"
        );
        res.redirect("/reset");
        //with all setted up we can send an emial to our user witk link that contains token
        return transporter.sendMail({
          to: "jakubantczak.info@gmail.com",
          from: "shoppage@node.pl",
          subject: "Reset password in our store",
          html: `<h3>You have requested a password reset!</h3>
          <p>Click on link below to reset your password</p>
          <a href="http://localhost:3000/reset:${token}">Link</a>`
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getPasswordChange = (req, res, next) => {
  //in here if uswer used that link we can retrive it through params in the page and use it in form
  const token = req.params.token;
  res.render("auth/newPassword", {
    pageTitle: "Password change",
    path: "/password-change",
    all: false,
    token: token,
    admin: false
  });
};

exports.postPasswordChange = (req, res, next) => {
  //once we recived token in body of the form we can use it
  const token = req.body.token.substr(1);
  const newPassword = req.body.password;
  let resetUser;
  //we need to check if our user exist and also if token has not expired
  User.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        req.flash(
          "resetMessage",
          "Your reset token expired. Please try once again to change it"
        );
        return res.redirect("/reset");
      }
      //great idea is to store every data of our user in let object
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    //always we need to remember to return some data from bcrypt because it returns us a hashedPassword that we an use
    .then(hashedPassword => {
      //here we can use our resetuser to overwrite the data of normal user with the data that we recived from form of reset password page
      resetUser.password = hashedPassword;
      resetUser.token = undefined;
      resetUser.resetTokenExpire = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch(err => {
      console.log(err);
    });
};
