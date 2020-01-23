exports.get404 = (req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, "./", "views", "404.html"));
  res.render("404", {
    pageTitle: "Page not found",
    path: "/404",
    admin: false,
    //in every page we need to check if our user is logged in or not. Of course we can make it by creating some middleware
    isAuthenticated: req.session.isLoggedIn
  });
};
exports.get500 = (req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, "./", "views", "404.html"));
  res.render("500", {
    pageTitle: "Server problem",
    path: "/500",
    admin: false,
    errormessage:
      "Właśnie wystąpił problem z serwerem, prosimy spróbować później",
    //in every page we need to check if our user is logged in or not. Of course we can make it by creating some middleware
    isAuthenticated: req.session.isLoggedIn
  });
};
