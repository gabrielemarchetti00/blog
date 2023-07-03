const Post = require("../models/post");
const Comment = require("../models/comment")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.create_post_get = asyncHandler(async (req, res, next) => {
    res.render("post-form", {
      title: "New Post",
      post: req.post
    })
});

exports.create_post_post = [
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("text", "Text must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            author: res.locals.currentUser,
            timestamp: Date.now()
        });

        if (!errors.isEmpty()) {
            res.render("post-form", {
                title: "New Post",
                errors: errors.array(),
                post: post
            });
        } else {
            await post.save();
            res.redirect("/");
        }
    })
]

exports.post_detail = asyncHandler(async(req, res, next) => {
    const [post, commentsOfPost] = await Promise.all([
      Post.findById(req.params.id).exec(),
      Comment.find( {post: req.params.id}, "text").exec()
    ])

    if(post === null) {
        const err = new Error("post not found")
        err.status = 404
        return next(err)
    }

    res.render("post-detail", {
        title: "Post Detail",
        post: post,
        post_comments: commentsOfPost
    })
})


exports.post_list = asyncHandler(async(req, res, next) => {
    const allPosts = await Post.find({}, "title text").exec()

    res.render("post-list", {title: "Post List", post_list: allPosts})
})

exports.post_delete_get = asyncHandler(async(req, res, next) => {
    const post = await Post.findById(req.params.id).exec()
  
    if (post === null) {
      res.redirect("/posts");
    }
  
    res.render("post-delete", {
      title: "Delete Post",
      post: post
    }); 
})
  
exports.post_delete_post = asyncHandler(async(req, res, next) => {
    await Post.findByIdAndRemove(req.body.postid);
    res.redirect("/posts");  
})

exports.post_update_get = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).exec()
  
    if (post === null) {
      const err = new Error("post not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("post-form", {
      title: "Update Post",
      post: post
    });
  });
  
  exports.post_update_post = [
    body("title", "Title must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("text", "text must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
  
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
  
      const post = new Post({
        title: req.body.title,
        text: req.body.text,
        price: req.body.price,
        timestamp: req.body.timestamp,
        author: req.body.author,
        _id: req.params.id
      });
  
      if (!errors.isEmpty()) {
        res.render("post-form", {
          title: "Update Post",
          post: post,
          errors: errors.array(),
        });
        return;
      } else {
        const thepost = await Post.findByIdAndUpdate(req.params.id, post, {});
        res.redirect(thepost.url);
      }
    }),
  ];
  