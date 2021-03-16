const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const async = require("async");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const flash = require("express-flash");

// GET request for creating an account/user
exports.user_create_get = (req, res, next) => {
  res.render("sign_up");
};

// POST request for creating an account/user
exports.user_create_post = [
  // Validate and sanitize fields.
  body("firstName")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Must provide a first name."),
  body("lastName")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Must provide a last name."),
  body("email")
    .isEmail()
    .withMessage("must provide a valid email")
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage("email must be less than 100 characters long"),
  body("password")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Must provide a password"),
  body("confirmPassword")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      // passwords match, so return true
      return true;
    })
    .withMessage("Must provide a password"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors.
      res.render("sign_up", {
        user: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
        },
        errors: errors.array(),
      });
      return;
    } else {
      // check to see if the email is in use
      User.findOne({ email: req.body.email }).exec((err, foundUser) => {
        if (foundUser) {
          res.render("item_form", {
            user: {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
            },
            errors: [
              {
                msg: `email is already in use.`,
              },
            ],
          });
        } else {
          // Email is not in use, so create user
          console.log("email is not being used");

          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            console.log("password hashed");
            if (err) {
              return next(err);
            }
            let user = new User({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              membershipStatus: "candidate",
              password: hashedPassword,
            });
            user.save((err) => {
              if (err) {
                return next(err);
              }
              res.redirect("/");
            });
          });
        }
      });
    }
  },
];

// GET request for loggin in
exports.user_login_get = (req, res, next) => {
  res.render("log_in");
};

// POST request for loggin in
exports.user_login_post = [
  body("email")
    .isEmail()
    .withMessage("must provide a valid email")
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage("email must be less than 100 characters long"),
  body("password")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Must provide a password"),

  (req, res, next) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      // There are errors.
      res.render("log_in", {
        user: {
          email: req.body.email,
        },
        errors: errors.array(),
      });
    } else {
      return next();
    }
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: true,
  }),
];

// GET requst for user log out
exports.user_logout_get = (req, res) => {
  req.logout();
  res.redirect("/");
};

// GET request for member application
exports.member_application_get = (req, res, next) => {
  res.render("member_application");
};

// POST request for member application
exports.member_application_post = [
  body("secret-code")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Must provide a secret code"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors.
      res.render("member_application", {
        errors: errors.array(),
      });
    } else {
      if (req.body["secret-code"] === "Open Sesame") {
        User.findByIdAndUpdate(req.user._id, {
          membershipStatus: "member",
        }).exec((err, foundUser) => {
          if (err) {
            return next(err);
          } else {
            req.flash(
              "info",
              "Your request to join our community has been approved. You are now a full member who can post and view the name of other posters."
            );
            res.redirect("/");
          }
        });
      } else {
        req.flash("error", "Incorrect Password");
        res.render("member_application");
      }
    }
  },
];

// GET request for admin application
exports.admin_application_get = (req, res, next) => {
  res.render("admin_application");
};

// POST request for admin application
exports.admin_application_post = [
  body("secret-code")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Must provide a secret code"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors.
      res.render("admin_application", {
        errors: errors.array(),
      });
    } else {
      if (req.body["secret-code"] === "I am the captain now") {
        User.findByIdAndUpdate(req.user._id, {
          isAdmin: true,
        }).exec((err, foundUser) => {
          if (err) {
            return next(err);
          } else {
            req.flash(
              "info",
              "Your request to become and admin has been approved. You are now have the ability to delete the messages of others. Use your power carefully!"
            );
            res.redirect("/");
          }
        });
      } else {
        req.flash("error", "Incorrect Password");
        res.render("admin_application");
      }
    }
  },
];
