const mongoose = require("mongoose");

const timeSheetSchema = new mongoose.Schema({
  venueName: String,
  startTime: String,
  endTime: String,
  date: Date,
  duration: Number,
  description: String,
  tag: String,
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
});

timeSheetSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Timesheet", timeSheetSchema);
