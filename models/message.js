var mongoose = require("mongoose");
const { DateTime } = require("luxon");

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  message: { type: String, required: true, maxLength: 400 },
  timePosted: {type: Date, default: Date.now},
  user: { type: Schema.Types.ObjectId, ref: "User", required: true},
});

// Format the time posted in a way that will render nicely
MessageSchema
.virtual('timePostedFormatted')
.get(function () {
  return DateTime.fromJSDate(this.timePosted).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Message", MessageSchema);