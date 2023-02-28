const express = require("express");
const router = express.Router();

const ItemsController = require("../controllers/items");

router.get("/a-z", ItemsController.Index);
router.get("/most-popular", ItemsController.MostPopular);
router.get("/most-recent", ItemsController.MostRecent);
router.get("/most-viewed", ItemsController.MostViewed);
router.get("/liked-by-you", ItemsController.LikedByYou);
router.get("/", ItemsController.Index);
router.post("/", ItemsController.Create);
router.get("/new", ItemsController.New);
router.get("/:id", ItemsController.ItemByID);
router.patch("/:id/like", ItemsController.Like);

module.exports = router;
