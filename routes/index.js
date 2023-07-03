var express = require('express');
var router = express.Router();
const user_controller = require("../controllers/userController")
const post_controller = require("../controllers/postController")
const comment_controller = require("../controllers/commentController")

router.get("/sign-up", user_controller.sign_up_get);
router.post("/sign-up", user_controller.sign_up_post);

router.get("/new-post", post_controller.create_post_get)
router.post("/new-post", post_controller.create_post_post)

router.get("/post/:id", post_controller.post_detail)

router.get("/posts", post_controller.post_list)

router.get("/post/:id/delete", post_controller.post_delete_get)
router.post("/post/:id/delete", post_controller.post_delete_post)

router.get("/post/:id/update", post_controller.post_update_get)
router.post("/post/:id/update", post_controller.post_update_post)

router.get("/post/:id/add-comment", comment_controller.create_comment_get)
router.post("/post/:id/add-comment", comment_controller.create_comment_post)

module.exports = router;
