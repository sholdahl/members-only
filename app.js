if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const configPassport = require("./config/passport");
let User = require("./models/user");

var app = express();

// mongoose connection
let mongoose = require("mongoose");
let dev_db_url = process.env.DB_STRING;
mongoose.connect(dev_db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connetion error: "));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Passport set up

configPassport(passport, User);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      membershipStatus: req.user.membershipStatus,
      _id: req.user._id
    };
    console.log("User Info: " + req.user);
  }
  next();
});

// Router

app.use("/", indexRouter);
app.use("/user", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);

  // Handle 404s
  if (err.status === 404) {
    res.render("404");
  }

  res.render("error");
});

module.exports = app;
