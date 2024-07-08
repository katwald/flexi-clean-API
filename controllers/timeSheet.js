/* eslint-disable indent */
const timeSheetRouter = require("express").Router();
const TimeSheet = require("../models/timeSheet");
const User = require("../models/user");
const auth = require("../utils/middleWare").auth;

// eslint-disable-next-line no-unused-vars
timeSheetRouter.post("/", auth, async (request, response, next) => {
  const user = await User.findById(request.user);
  const { venueName, date, startTime, endTime, description } = request.body;

  const timeSheet = new TimeSheet({
    venueName,
    startTime,
    endTime,
    date,
    description,
    user,
  });
  if (!venueName || !startTime || !endTime || !date || !description) {
    response.status(400).end();
  } else {
    const savedTimeSheet = await timeSheet.save();
    response.status(201).json(savedTimeSheet);
  }
  next();
});

timeSheetRouter.put("/:id", auth, async (request, response, next) => {
  // console.log("request", request.body);
  const id = request.params.id;
  const { venueName, date, startTime, endTime, description } = request.body;

  const user = await User.findById(request.user);

  if (!user) {
    response.status(400).end();
  } else {
    const updateTimeSheet = await TimeSheet.findByIdAndUpdate(
      id,
      { venueName, startTime, endTime, date, description },
      {
        new: true,
      }
    );
    response.json(updateTimeSheet);
  }
  next();
});

timeSheetRouter.get("/", auth, async (request, response, next) => {
  const timeSheet = await TimeSheet.find({}).populate("user", {
    firstName: 1,
    lastName: 1,
  });

  const user = await User.findById(request.user);
  if (!user) {
    response.json(404).end();
  }
  response.json(timeSheet).status(200);
  next();
});

timeSheetRouter.delete("/:id", auth, async (request, response, next) => {
  const id = request.params.id;
  const user = await User.findById(request.user);

  if (!id || !user) {
    response.status(404).end();
  } else {
    await TimeSheet.findByIdAndRemove(id);
    response.status(204).end();
  }
  next();
});

module.exports = timeSheetRouter;
