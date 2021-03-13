const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;



const localStrategy = new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match, so render
          return done(null, user);
        } else {
          // passwords do not match
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })

  module.exports = localStrategy;