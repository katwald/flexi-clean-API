const bookingsRouter = require("express").Router();

const Booking = require("../models/booking");

bookingsRouter.get("/test", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// eslint-disable-next-line no-unused-vars
bookingsRouter.post("/", async (request, response) => {
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
  if (!venueName || !bookingStart || !bookingEnd || !cleaningDate) {
    response.status(400).end();
  } else {
    const savedBooking = await booking.save();
    response.status(201).json(savedBooking);
  }
});

bookingsRouter.put("/:id", async (request, response) => {
  console.log("request", request.body);
  const id = request.params.id;
  const { venueName } = request.body;
  const { bookingStart, bookingEnd, bookingDescription, cleaningDate } =
    request.body.bookingStatus;
  const { cleanedDate, assignedCleaner, cleaningStatus, cleaningHour } =
    request.body.cleaningStatus;

  const booking = {
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
  };
  if (!venueName || !bookingStart || !bookingEnd || !cleaningDate) {
    response.status(400).end();
  } else {
    const updatedBooking = await Booking.findByIdAndUpdate(id, booking, {
      new: true,
    });
    response.json(updatedBooking);
  }
});

bookingsRouter.get("/", async (request, response) => {
  const bookings = await Booking.find({});
  response.json(bookings);
});

bookingsRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const booking = await Booking.findById(id);
  if (!id || !booking) {
    response.status(404).end();
  } else {
    response.json(booking);
  }
});

bookingsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  if (!id) {
    response.status(404).end();
  } else {
    await Booking.findByIdAndRemove(id);
    response.status(204).end();
  }
});

module.exports = bookingsRouter;
