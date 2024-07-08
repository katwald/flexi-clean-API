const { MONGODB_URI } = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
app.use(express.static("build")); // express checks if build directory contains a  requested file and if found returns it.
const cors = require("cors");

const bookingRouter = require("./controllers/booking");
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/signIn");
const mongoose = require("mongoose");
const timeSheetRouter = require("./controllers/timeSheet");
// const { PORT } = require("./utils/config.js");
// const options = require("./swagger");
// const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");

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

// swaggerApiDocs(app, PORT);
app.use("/api/users/", userRouter);
app.use("/api/login/", loginRouter);
app.use("/api/bookings/", bookingRouter);
app.use("/api/time-sheet", timeSheetRouter);

// const specs = swaggerJsdoc(options);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// function swaggerDocs(app, port) {
// swagger page
//Docs in Json format
//   app.get("docs.json", (req, res) => {
//     res.setHeader("Content-Type", "application/json");
//     res.send(specs);
//   });
// console.log(`docs available at http://localhost:${port}/docs`);
// }
module.exports = app;
