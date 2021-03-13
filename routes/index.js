const express = require("express");
const router = express.Router();

// Controllers
let user_controller = require("../controllers/userController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

// GET user sign up form
router.get("/sign-up", user_controller.user_create_get);

// POST user sign up form
router.post("/sign-up", user_controller.user_create_post);

// GET user log in
router.get("/log-in", user_controller.user_login_get);

// POST user log in
router.post("/log-in", user_controller.user_login_post);

// GET user log out
router.get("/log-out", user_controller.user_logout_get);

module.exports = router;
