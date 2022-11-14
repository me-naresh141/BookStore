let express = require("express");
const book = require("../modals/book");
let Comment = require("../modals/comment");
let Book = require("../modals/book");
let router = express.Router();

// like
router.get("/:id/like", (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, comment) => {
    if (err) return next(err);
    res.redirect("/books/" + comment.bookId);
  });
});

// dislike
router.get("/:id/dislike", (req, res, next) => {
  let id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (comment.likes > 0) {
      Comment.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, comment) => {
        res.render("singalbook");
      });
    }
    res.redirect("/books/" + comment.bookId);
  });
});
// find comment edit form
router.get("/:id/edit", (req, res, next) => {
  let id = req.params.id;
  Comment.findById(id, (err, comment) => {
    // console.log(comment)
    res.render("editcomment", { comment });
  });
});

// update a comment
router.post("/:id", (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
    if (err) return next(err);
    res.redirect("/books/" + comment.bookId);
  });
});

// delete comment
router.get("/:id/delete", (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndDelete(id, (err, comment) => {
    if (err) return next(err);
    Book.findByIdAndUpdate(
      comment.bookId,
      { $pull: { comments: comment._id } },
      (err, book) => {
        res.redirect("/books/" + comment.bookId);
      }
    );
  });
});

module.exports = router;
