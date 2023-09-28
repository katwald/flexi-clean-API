const { MONGODB_URI } = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");

const bookingRouter = require("./controllers/booking");
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/signIn");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGODB_URI)
  // eslint-disable-next-line no-unused-vars
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => console.log("error connecting to Mongodb", error.messsage));

app.use(cors());
app.use(express.json());

app.use("/api/users/", userRouter);
app.use("/api/login/", loginRouter);
app.use("/api/bookings/", bookingRouter);

module.exports = app;
