var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/settings', function(req, res, next) {
  res.send('Under construction. <a href="/">Return to homepage</a>');
});

module.exports = router;
