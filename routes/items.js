const express = require("express");
const router = express.Router();

const ItemsController = require("../controllers/items");

router.get("/", ItemsController.Index);
router.post("/", ItemsController.Create);
router.get("/new", ItemsController.New);
router.get("/:id", ItemsController.ItemByID);
router.patch("/:id/like", ItemsController.Like);

module.exports = router;
