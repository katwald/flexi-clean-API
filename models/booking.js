const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  venueName: String,
  bookingStatus: {
    bookingStart: Date,
    bookingEnd: Date,
    bookingDescription: String,
    cleaningDate: Date,
    cleaningTag: String,
  },
  cleaningStatus: {
    cleanedDate: Date,
    cleaningStatus: String,
    cleaningHour: Number,
    assignedCleaner: String,
  },
  user: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  ],
  comments: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Comment" }],
});

bookingSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Booking", bookingSchema);
