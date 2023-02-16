/* eslint-disable quotes */
const Post = require("../models/post");
const Comment = require("../models/comment");
const Request = require("../models/request");
const User = require("../models/user");

const PostsController = {
  Index: async (req, res) => {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      const { username } = req.session.user;
      const user = await User.findOne({ username: username });
      const friends = user.friends || [];
      const allRequests = await Request.find({ status: "pending" });

      await Post.find((err, posts) => {
        if (err) {
          throw err;
        }

        posts.forEach((post) => {
          const req1 = allRequests.find(
            (request) =>
              request.requesterUsername === username &&
              request.requesteeUsername === post.author
          );
          const req2 = allRequests.find(
            (request) =>
              request.requesterUsername === post.author &&
              request.requesteeUsername === username
          );

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
            post.requestStatus = "You";
          } else if (req1) {
            post.requestStatus = "Request Sent";
          } else if (req2) {
            post.requestStatus = "Request Received";
          } else if (friends.includes(post.author)) {
            post.requestStatus = "Friends";
          } else {
            post.requestStatus = "+ Request";
          }

          if (post.requestStatus === "+ Request") {
            post.requestButtonEnabled = true;
          } else {
            post.requestButtonEnabled = false;
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
