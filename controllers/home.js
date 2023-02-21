const HomeController = {
  Index: (req, res) => {
    if (req.session.user) {
      res.redirect("/items");
    } else {
      res.render("home/index", { title: "FableMart" });
    }
  },
};

module.exports = HomeController;
