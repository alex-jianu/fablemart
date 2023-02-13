/* eslint-disable quotes */
const Post = require("../models/post");

const PostsController = {
  Index: async (req, res) => {
    let username = req.session.user.username;

    await Post.find((err, posts) => {
      if (err) {
        throw err;
      }

      posts.forEach((post) => {
        if (post.likedBy.includes(username)) {
          post.isLiked = true;
        } else {
          post.isLiked = false;
        }
      });

      res.render("posts/index", {
        posts: posts.reverse(),
        user: req.session.user,
      });
    });
  },

  New: (req, res) => {
    res.render("posts/new", { user: req.session.user });
  },
  Create: (req, res) => {
    const post = new Post(req.body);
    post.author = req.session.user.username;
    post.likes = 0;
    post.likedBy = [];
    post.message = post.message.trim();

    if (post.message === "") {
      res.redirect("/posts/new");
    } else {
      post.save((err) => {
        if (err) {
          throw err;
        }

        res.status(201).redirect("/posts");
      });
    }
  },
  Like: async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post.likedBy.includes(req.session.user.username)) {
      const query = { _id: req.params.id };
      const newLikes = post.likes - 1;
      const newLikedBy = post.likedBy.filter(
        (entry) => entry !== req.session.user.username
      );
      await Post.updateOne(query, { likes: newLikes, likedBy: newLikedBy });
      res.redirect("/posts");
    } else {
      const query = { _id: req.params.id };
      const newLikes = post.likes + 1;
      const newLikedBy = post.likedBy.concat(req.session.user.username);
      await Post.updateOne(query, { likes: newLikes, likedBy: newLikedBy });
      res.redirect("/posts");
    }
  },
};

module.exports = PostsController;
