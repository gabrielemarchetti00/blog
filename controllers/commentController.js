const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");

exports.create_comment_get = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).exec()
  
    if (post === null) {
      res.redirect("/posts");
    }

    res.render("comment-form", {
      title: "New Comment",
      comment: req.comment,
      post: post
    })
});

exports.create_comment_post = [
    body("text", "Text must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const comment = new Comment({
            text: req.body.text,
            author: res.locals.currentUser,
            timestamp: Date.now(),
            post: req.body.postid
        });

        if (!errors.isEmpty()) {
            res.render("comment-form", {
                title: "New Comment",
                errors: errors.array(),
                comment: comment,
            });
        } else {
            await comment.save();
            res.redirect("/posts");
        }
    })
]

exports.post_detail = asyncHandler(async(req, res, next) => {
    const post = await Post.findById(req.params.id).exec()

    if(post === null) {
        const err = new Error("post not found")
        err.status = 404
        return next(err)
    }

    res.render("post-detail", {
        title: "Post Detail",
        post: post,
    })
})