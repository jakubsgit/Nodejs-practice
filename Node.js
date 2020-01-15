const path = require("path");

const bodyParser = require("body-parser");
const express = require("express");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// We can write app.use('/admin', (adminRoutes)) to have path following by /admin
app.use(adminRoutes.routes);
app.use(shopRouter);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, "./", "views", "404.html"));
  res.render("404", { pageTitle: "Page not found" });
});

app.listen(3000);
