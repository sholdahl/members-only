const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Controllers
let user_controller = require("../controllers/userController");
let message_controller = require("../controllers/messageController");

/* GET home page. */
router.get("/", message_controller.index);

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

// GET create a post
router.get("/post", auth.isAuth, auth.isMember, message_controller.message_create_get);

// POST create a post
router.post("/post", auth.isAuth, auth.isMember, message_controller.message_create_post);

module.exports = router;
