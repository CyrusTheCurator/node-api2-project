const express = require("express");
const router = express.Router();
const {
  find,
  findById,
  insert,
  update,
  remove,
  findPostComments,
  findCommentById,
  insertComment,
} = require("../data/db.js");

router.get("/", (req, res) => {
  find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "Hey, something happened and we don't know what" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  findById(id)
    .then((post) => {
      post.length > 0
        ? res.status(200).json(post)
        : res.status(404).json({ error: "this post ID doesn't exist, sorry" });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "Hey, something happened and we don't know what" });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;

  findById(id)
    .then((post) => {
      post.length > 0
        ? findPostComments(id)
            .then((comment) => {
              comment.length > 0
                ? res.status(200).json(comment)
                : res
                    .status(404)
                    .json({ error: "this post doesn't have any comments" });
            })
            .catch((err) => {
              res.status(500).json({
                error: "Hey, something happened and we don't know what",
              });
            })
        : res.status(404).json({ error: "this ID doesn't exist, sorry" });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "Hey, something happened and we don't know what" });
    });
});

router.post("/", (req, res) => {
  console.log(req.body);
  insert(req.body)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json({
        error: `Hey, something happened and we don't know what ${err}`,
      });
    });
});

router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const comment = req.body;
  comment.post_id = id;

  if (!comment.text) {
    res.status(400).json({ message: "Please type your comment" });
  }

  findById(id).then((post) => {
    post.length !== 0
      ? insertComment(comment)
          .then((msg) => {
            res.status(201).json({ message: msg });
          })
          .catch((err) => {
            res.status(500).json({
              error: `Hey, something happened and we don't know what ${err}`,
            });
          })
      : res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let deletedPost;

  findById(id)
    .then((post) => {
      post.length > 0
        ? (deletedPost = post)
        : res.status(404).json({ error: "this post ID doesn't exist, sorry" });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "Hey, something happened and we don't know what" });
    });

  remove(id)
    .then((post) => {
      post > 0
        ? res
            .status(200)
            .json({ message: `successfully deleted post`, post: deletedPost })
        : res.status(404).json({ error: "post not found" });
    })
    .catch((err) => {
      res.status(500).json({ error: `some problems... ${err}` });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const post = req.body;

  update(id, post)
    .then((newPost) => {
      findById(id)
        .then((post) => {
          post.length > 0
            ? res.status(200).json(post)
            : res
                .status(404)
                .json({ error: "this post ID doesn't exist, sorry" });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ error: `an error, we've found an error! ${err}` });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: `some problems... ${err}` });
    });
});

//   | POST   | /api/posts/:id/comments | Creates a comment for the post with the specified id using information sent inside of the `request body`.|
//   | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**.
// You may need to make additional calls to the database in order to satisfy this requirement. |
//   | PUT    | /api/posts/:id          | Updates the post with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**.
module.exports = router;
