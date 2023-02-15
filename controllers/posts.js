/* eslint-disable quotes */
const Post = require("../models/post");
const Comment = require("../models/comment");
const Request = require("../models/request");

const PostsController = {
  Index: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const { username } = req.session.user;
      const req1 = await Request.find({requesterUsername: username, requesteeUsername: post.author});
      const req2 = await Request.find({requesterUsername: post.author, requesteeUsername: username});

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

          if (post.likes === 1) {
            post.isMultiple = false;
          } else {
            post.isMultiple = true;
          }

          if (post.comments.length === 1) {
            post.commentsPlural = false;
          } else {
            post.commentsPlural = true;
          }

          if (post.author === username) {
            post.isSame = true
          } else if (req1 && req1.status === "pending") {
            post.hasSentRequest = true;
          } else if (req2 && req2.status === "pending") {
            post.hasReceivedRequest = true;
          } else if (req1.status === "confirmed" || req2.status === "confirmed") {
          }

      });

        res.render("posts/index", {
          posts: posts.reverse(),
          user: req.session.user,
        });
      });
    }
  },

  New: (req, res) => {
    res.render("posts/new", { user: req.session.user });
  },
  Create: (req, res) => {
    const post = new Post(req.body);
    post.author = req.session.user.username;
    post.likes = 0;
    post.likedBy = [];
    post.comments = [];
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
  PostByID: async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!req.session.user) {
      res.redirect("/");
    } else {
      const { username } = req.session.user;

      await Comment.find({ postID: post._id }, (err, comments) => {
        if (err) {
          throw err;
        }

        comments.forEach((comment) => {
          if (comment.likedBy.includes(username)) {
            comment.isLiked = true;
          } else {
            comment.isLiked = false;
          }

          if (comment.likes === 1) {
            comment.isMultiple = false;
          } else {
            comment.isMultiple = true;
          }
        });

        res.render("posts/id", {
          post: post,
          comments: comments,
          id: post._id,
          user: req.session.user,
        });
      });
    }
  },
  Comment: (req, res) => {
    res.render("posts/new-comment", {
      user: req.session.user,
      postID: req.params.id,
    });
  },
  PostComment: async (req, res) => {
    const comment = new Comment(req.body);
    comment.author = req.session.user.username;
    comment.likes = 0;
    comment.likedBy = [];
    comment.message = comment.message.trim();
    comment.postID = req.params.id;
    const post = await Post.findById(req.params.id);
    const newComments = post.comments.concat(comment);

    await Post.updateOne({ _id: req.params.id }, { comments: newComments });

    if (comment.message === "") {
      res.redirect("/posts/:id/comment");
    } else {
      comment.save((err) => {
        if (err) {
          throw err;
        }

        res.status(201).redirect(`/posts/${req.params.id}`);
      });
    }
  },
};

module.exports = PostsController;
