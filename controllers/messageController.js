const Message = require("../models/message");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const async = require("async");
const flash = require("express-flash");
const { rawListeners } = require("../app");

// GET request for index
exports.index = (req, res, next) => {
  let loggedIn = Boolean(req.user);
  let isMember = null;
  if (loggedIn) {
    req.user.membershipStatus === "member"
      ? (isMember = true)
      : (isMember = false);
  }

  Message.find()
    .populate("user")
    .sort([["timePosted", "descending"]])
    .exec((err, postedMessages) => {
      if (err) {
        return next(err);
      }
      console.log(postedMessages[0].user._id);
      req.user ? console.log(req.user._id) : console.log("not logged in");
      req.user
        ? console.log(req.user._id === postedMessages[0].user._id)
        : console.log("not logged in");
      res.render("index", { postedMessages, loggedIn, isMember });
    });
};

// GET request for creating a message
exports.message_create_get = (req, res, next) => {
  res.render("message_form");
};

// POST request for creating a message
exports.message_create_post = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Must provide a message title."),
  body("message")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .escape()
    .withMessage("Must provide a message title."),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty() || !req.user) {
      if (!req.user) {
        req.flash("error", "You must be logged in to submit this form.");
      }
      // There are errors.
      res.render("post", {
        message: {
          title: req.body.title,
          message: req.body.message,
        },
        errors: errors.array(),
      });
      return;
    } else {
      // try to find the user
      User.findById(req.user._id).exec((err, foundUser) => {
        if (err) {
          return next(err);
        }
        if (!foundUser) {
          req.flash("error", "You must be logged in to submit this form.");
          res.render("post", {
            message: {
              title: req.body.title,
              message: req.body.message,
            },
          });
        } else {
          let message = new Message({
            title: req.body.title,
            message: req.body.message,
            timePosted: new Date(),
            user: foundUser._id,
          });

          message.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/");
          });
        }
      });
    }
  },
];

// GET request to delete an item
exports.message_delete_get = (req, res, next) => {
  Message.findById(req.params.id)
    .populate("user")
    .exec((err, foundMessage) => {
      if (err) {
        return next(err);
      }
      if (foundMessage == null) {
        req.flash(
          "error",
          "There was an error deleting the message, please try again later."
        );
        res.redirect("/");
      } else {
        res.render("message_delete", {
          foundMessage: foundMessage,
        });
      }
    });
};

// GET request to delete an item
exports.message_delete_post = (req, res, next) => {
  Message.findById(req.body.id)
    .populate("user")
    .exec((err, foundMessage) => {
      if (err) {
        return next(err);
      }

      if (String(foundMessage.user._id) !== String(req.user._id)) {
        req.flash("error", "You are not authorized to delete this message");
        res.redirect("/" + req.body.id);
      } else {
        Message.findByIdAndRemove(req.body.id, (err) => {
          if (err) {
            return next(err);
          }
          req.flash(
            "info",
            `You successfully deleted the post titled ${foundMessage.title}`
          );
          res.redirect("/");
        });
      }
    });
};
