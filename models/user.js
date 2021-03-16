var mongoose = require("mongoose");

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  firstName: { type: String, required: true, maxLength: 100 },
  lastName: { type: String, required: true, maxLength: 100 },
  email: { type: String, require: true, maxLength: 100},
  membershipStatus: {type: String, required: true, maxLength: 100},
  isAdmin: {type: Boolean, required: false, default: false},
  password: {type: String},
});

module.exports = mongoose.model("User", UserSchema);