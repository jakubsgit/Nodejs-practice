require("dotenv").config();
const path = require("path");

const mongoConnect = require("./util/database").mongoConnect;

const User = require("./models/user");

const bodyParser = require("body-parser");
const express = require("express");

const app = express();

const errorController = require("./controllers/error");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");

app.use((req, res, next) => {
  User.findById("5e25ac4e1c9d44000094f4b8")
    .then(user => {
      console.log(user);
      req.user = new User(
        user.username,
        user.email,
        { ...user.cart },
        user._id
      );
      next();
    })
    .catch(err => console.log(err));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// We can write app.use('/admin', (adminRoutes)) to have path following by /admin
app.use(adminRoutes);
app.use(shopRouter);
app.use(errorController.get404);

mongoConnect(client => {
  app.listen(3000);
});
