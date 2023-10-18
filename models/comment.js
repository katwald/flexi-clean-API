const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    minLength: 1,
  },
  userId: {
    type: String,
    required: true,
    minLength: 1,
  },
  booking: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Booking",
  },
});

commentSchema.plugin(uniqueValidator);

commentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
