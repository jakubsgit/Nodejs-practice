//in middlewares we can create functions that will be reusable. In this case we can chack in every controller if someone is loggedIn during the whole session.

module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};
