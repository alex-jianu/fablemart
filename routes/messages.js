const express = require("express");
const router = express.Router();

const MessagesController = require("../controllers/messages");

router.get("/", MessagesController.Index);
router.get("/:username", MessagesController.MessagesByUsername);
router.patch("/:username", MessagesController.Create);

module.exports = router;
