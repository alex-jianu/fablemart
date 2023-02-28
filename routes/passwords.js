const express = require("express");
const router = express.Router();

const PasswordsController = require("../controllers/passwords");

router.get("/", PasswordsController.Index);
router.post("/", PasswordsController.Recover);

module.exports = router;
