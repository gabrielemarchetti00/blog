const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs")

exports.sign_up_get = asyncHandler(async (req, res, next) => {
    res.render("sign-up-form", {
      title: "Sign Up"
    })
});

exports.sign_up_post = [
    body("username", "Username must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("email", "Email must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("status", "Status must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("password", "Password must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("confirmPassword", "Confirm password must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body('confirmPassword', "Password do not match").custom((value, { req }) => {
        return value === req.body.password;
    }),

    asyncHandler(async (req, res, next) => {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if(err) {
            return next(err)
          }
          else {
            const errors = validationResult(req);

            let member_status = "not_member"
            console.log(req.body.admin)
            if(req.body.admin) {
              console.log("ciao")
              member_status = "member"
            }

            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                status: req.body.status
            });
    
            if (!errors.isEmpty()) {
                res.render("sign-up-form", {
                    title: "Sign Up",
                    user: user,
                    errors: errors.array(),
                });
            } else {
                await user.save();
                res.redirect("/");
            }
          }
        });
    })
]