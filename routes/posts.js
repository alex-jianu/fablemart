const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");
const Post = require("../models/post");

router.get("/", PostsController.Index);
router.post("/", PostsController.Create);
router.get("/new", PostsController.New);
router.patch("/:id/like", PostsController.Like);

module.exports = router;
