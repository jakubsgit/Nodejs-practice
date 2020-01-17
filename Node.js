const path = require("path");

const bodyParser = require("body-parser");
const express = require("express");

const app = express();

const errorController = require("./controllers/error");
const db = require("./util/database");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");

db.execute("SELECT * FROM products")
  .then(result => console.log(result))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// We can write app.use('/admin', (adminRoutes)) to have path following by /admin
app.use(adminRoutes);
app.use(shopRouter);
app.use(errorController.get404);

app.listen(3000);
