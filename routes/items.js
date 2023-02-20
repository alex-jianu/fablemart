const express = require("express");
const router = express.Router();

const ItemController = require("../controllers/items");

router.get("/", ItemController.Index);

module.exports = router;