const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const initialize = (passport, User) => {
  const customFields = {
    usernameField: "email",
  };

  const localStrategy = new LocalStrategy(
    customFields,
    (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
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
    }
  );

  passport.use(localStrategy);

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

module.exports = initialize;
