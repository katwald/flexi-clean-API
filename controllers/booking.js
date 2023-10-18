/* eslint-disable indent */
const bookingsRouter = require("express").Router();

const Booking = require("../models/booking");
const Comment = require("../models/comment");
const User = require("../models/user");
const auth = require("../utils/middleWare").auth;

bookingsRouter.get("/test", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// eslint-disable-next-line no-unused-vars
bookingsRouter.post("/", auth, async (request, response, next) => {
  const user = await User.findById(request.user);
  const userIsSupervisor = user.role === "Supervisor";

  const { venueName } = request.body;
  const { bookingStart, bookingEnd, bookingDescription, cleaningDate } =
    request.body.bookingStatus;
  const { cleanedDate, assignedCleaner, cleaningStatus, cleaningHour } =
    request.body.cleaningStatus;

  const booking = new Booking({
    venueName: venueName,
    bookingStatus: {
      bookingStart,
      bookingEnd,
      bookingDescription,
      cleaningDate,
    },
    cleaningStatus: {
      cleanedDate,
      assignedCleaner,
      cleaningStatus,
      cleaningHour,
    },
    comments: [],
  });
  if (
    !venueName ||
    !bookingStart ||
    !bookingEnd ||
    !cleaningDate ||
    !userIsSupervisor
  ) {
    response.status(400).end();
  } else {
    const savedBooking = await booking.save();
    response.status(201).json(savedBooking);
  }
  next();
});
// comments
bookingsRouter.post("/:id", auth, async (request, response) => {
  const body = request.body;
  const user = await User.findById(request.user);
  const booking = await Booking.findById(request.params.id);
  console.log("rea---", request.body);
  const comment = new Comment({
    comment: body.comment,
    userId: user._id.toString(),
  });
  if (!comment) {
    response.status(400).end();
  } else {
    const savedComment = await comment.save();
    console.log("saved--comment", savedComment);

    booking.comments = booking.comments.concat(savedComment._id);
    await booking.save();
    response.status(201).json(savedComment);
  }
});
bookingsRouter.put("/:id", auth, async (request, response, next) => {
  // console.log("request", request.body);
  const id = request.params.id;
  const { venueName } = request.body;
  const { bookingStart, bookingEnd, bookingDescription, cleaningDate } =
    request.body.bookingStatus;
  const { cleanedDate, cleaningStatus, assignedCleaner, cleaningHour } =
    request.body.cleaningStatus;
  const user = await User.findById(request.user);
  // console.log("user", user);
  const getBookingFromDB = await Booking.findById(id);

  const userIsSupervisor = user.role === "Supervisor";
  const userIsEmployee = user.role === "Employee";

  const employeeReadWriteAccess = () => {
    const userId = user._id.toString();
    const assignedEmployeeInDB =
      getBookingFromDB.cleaningStatus.assignedCleaner;
    // supervisor can assign to any one
    if (!assignedEmployeeInDB && userIsSupervisor) {
      return assignedCleaner;
      // if no one is assigned both supervisor and employee can assign to themselves.
    } else if ((!assignedEmployeeInDB && userIsEmployee) || userIsSupervisor) {
      return userId;
      // loggedin employee can remove himself or super visor can remove any one
    } else if (
      (userIsEmployee && assignedEmployeeInDB === userId) ||
      userIsSupervisor
    ) {
      console.log("step 2");
      return "";
    } else if (
      userIsEmployee &&
      assignedEmployeeInDB &&
      assignedEmployeeInDB !== userId
    ) {
      console.log("ster 3");
      return assignedEmployeeInDB;
    }
  };

  const booking = {
    venueName: !userIsSupervisor ? getBookingFromDB.venueName : venueName,
    bookingStatus: !userIsSupervisor
      ? getBookingFromDB.bookingStatus
      : {
          bookingStart,
          bookingEnd,
          bookingDescription,
          cleaningDate,
        },
    cleaningStatus: {
      cleanedDate,
      assignedCleaner: employeeReadWriteAccess(),
      cleaningStatus,
      cleaningHour,
    },
    comments: [],
    user: [user.id],
  };
  if (!user && !(userIsEmployee && userIsSupervisor)) {
    response.status(400).end();
  } else {
    const updatedBooking = await Booking.findByIdAndUpdate(id, booking, {
      new: true,
    });
    response.json(updatedBooking);
  }
  next();
});

bookingsRouter.get("/", auth, async (request, response, next) => {
  const bookings = await Booking.find({}).populate("user", {
    firstName: 1,
    lastName: 1,
  });
  //     .populate("comments", { comment: 1 });
  const user = await User.findById(request.user);
  if (!user) {
    response.json(404).end();
  }
  response.json(bookings);
  next();
});

bookingsRouter.get("/:id", async (request, response, next) => {
  const id = request.params.id;
  const booking = await Booking.findById(id);
  if (!id || !booking) {
    response.status(404).end();
  } else {
    response.json(booking);
  }
  next();
});

bookingsRouter.delete("/:id", auth, async (request, response, next) => {
  const id = request.params.id;
  const user = await User.findById(request.user);
  const userIsSupervisor = user.role === "Supervisor";

  if (!id || !userIsSupervisor) {
    response.status(404).end();
  } else {
    await Booking.findByIdAndRemove(id);
    response.status(204).end();
  }
  next();
});

module.exports = bookingsRouter;
