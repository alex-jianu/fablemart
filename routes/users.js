const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");

router.get("/new", UsersController.New);
router.post("/", UsersController.Create);
router.get("/:username", UsersController.Profile);
router.get("/:username/edit", UsersController.Edit);
// router.post("/:username/items", UsersController.Items);

module.exports = router;
