require("dotenv").config();
const path = require("path");

const User = require("./models/user");

const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

const store = new MongoDBStore({
  uri: `${process.env.MONGODB_URI}`,
  collection: "sessions"
});

const errorController = require("./controllers/error");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    useUnifiedTopology: true,
    secret: "my secret",
    resave: true,
    store: store
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// We can write app.use('/admin', (adminRoutes)) to have path following by /admin
app.use(adminRoutes);
app.use(shopRouter);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://jakubsnode:kytne2-tuccut-hogceT@jakubsnode-ac2qp.mongodb.net/shop?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Jakub",
          email: "jakub@jakub.pl",
          cart: { items: [] }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
