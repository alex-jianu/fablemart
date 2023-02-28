var mongoose = require("mongoose");

require("../mongodb_helper");
var Post = require("../../models/post");
// If spec changes for a post change the dictionary fields below
var new_post = {author: "somerandomuser", message: "some message", likes: 0}

describe("Post model", () => {
  beforeEach((done) => {
    mongoose.connection.collections.posts.drop(() => {
      done();
    });
  });

  it("has a message", () => {
    var post = new Post(new_post);
    expect(post.message).toEqual("some message");
  });

  it("can list all posts", (done) => {
    Post.find((err, posts) => {
      expect(err).toBeNull();
      expect(posts).toEqual([]);
      done();
    });
  });

  it("can save a post", (done) => {
    var post = new Post(new_post);

    post.save((err) => {
      expect(err).toBeNull();

      Post.find((err, posts) => {
        expect(err).toBeNull();

        expect(posts[0]).toMatchObject(new_post);
        done();
      });
    });
  });
});
