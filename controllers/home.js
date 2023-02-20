const HomeController = {
  Index: (req, res) => {
    res.render("home/index", { title: "FableMart" });
  },
};

module.exports = HomeController;
