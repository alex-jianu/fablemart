const express = require("express");
const router = express.Router();

const RequestsController = require("../controllers/requests");
const Request = require("../models/request");

router.post("/:username", RequestsController.Send);
router.get("/", RequestsController.Index);


module.exports = router;