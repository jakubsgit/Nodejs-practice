const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("nodejs", "root", process.env.PASSWORD, {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
