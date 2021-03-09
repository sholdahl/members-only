var mongoose = require("mongoose");

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  message: { type: String, required: true, maxLength: 400 },
  timeStamp: { type: Date, required: true},
});

module.exports = mongoose.model("Message", MessageSchema);