require("dotenv").config();
const path = require("path");

const User = require("./models/user");

const csurf = require("csurf");
const flash = require("connect-flash");

const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

//creating a session store in MongoDB
const store = new MongoDBStore({
  uri: `${process.env.MONGODB_URI}`,
  collection: "sessions"
});

const csurfProtection = csurf();

const errorController = require("./controllers/error");
//here we can setup views engine that is ejs in our project
app.set("view engine", "ejs");

//seting up root direction for all views ( then we can write "auth/login" if we want to get login page from views)
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRoutes = require("./routes/auth");

//Here we set up bodyparser to get some data that is retrive by requests in body
app.use(bodyParser.urlencoded({ extended: false }));

//serving static files in express
app.use(express.static(path.join(__dirname, "public")));
//setting up some session and naming store from Mongo
app.use(
  session({
    useUnifiedTopology: true,
    secret: "my secret",
    resave: true,
    saveUninitialized: true,
    store: store
  })
);
//using csurf protection to get token from session
app.use(csurfProtection);
//using flash to get data across components
app.use(flash());

//setting req.user from database if already exists to retrive data much faster
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

//checking if crsf token matches our token of the session
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// We can write app.use('/admin', (adminRoutes)) to have path following by /admin
app.use(adminRoutes);
app.use(shopRouter);
app.use(authRoutes);
app.use(errorController.get404);

//connectin whole app to MongoDB in addictional code we can create user in our DataBase if we have any
mongoose
  .connect(
    "mongodb+srv://jakubsnode:kytne2-tuccut-hogceT@jakubsnode-ac2qp.mongodb.net/shop?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    // User.findOne().then(user => {
    //   if (!user) {
    //     const user = new User({
    //       name: "Jakub",
    //       email: "jakub@jakub.pl",
    //       cart: { items: [] }
    //     });
    //     user.save();
    //   }
    // });
    console.log("DBconnected!");
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
