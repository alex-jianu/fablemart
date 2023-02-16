const express = require("express");
const router = express.Router();

const RequestsController = require("../controllers/requests");
const Request = require("../models/request");

router.post("/:username", RequestsController.Send);
router.get("/", RequestsController.Index);
router.patch("/:id/confirm", RequestsController.Confirm);
router.patch("/:id/decline", RequestsController.Decline);
router.patch("/:id/cancel", RequestsController.Cancel);

module.exports = router;