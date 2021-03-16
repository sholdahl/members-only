var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");

// Controllers
let user_controller = require("../controllers/userController");

/* GET users listing. */
router.get("/settings", function (req, res, next) {
  res.send('Under construction. <a href="/">Return to homepage</a>');
});

// GET member application
router.get("/member-application", auth.isAuth, user_controller.member_application_get);

// POST member applciation
router.post("/member-application", auth.isAuth, user_controller.member_application_post);

// GET admin application
router.get("/admin-application", auth.isAuth, auth.isMember, user_controller.admin_application_get);

// POST admin applciation
router.post("/admin-application", auth.isAuth, auth.isMember, user_controller.admin_application_post);

module.exports = router;