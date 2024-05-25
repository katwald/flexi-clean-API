/* eslint-disable indent */
const bookingsRouter = require("express").Router();

const Booking = require("../models/booking");
const Comment = require("../models/comment");
const User = require("../models/user");
const auth = require("../utils/middleWare").auth;

bookingsRouter.get("/test", (request, response) => {
  response.send(["<h1>Hello World!</h1>", "<h1>Hello World!</h1>"]);
});

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/Booking'
 *     responses:
 *       '201':
 *         description: Successfully created a new Booking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       '401':
 *         description: Unauthorized
 *       '400':
 *         description: Bad request
 */

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

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update a bookings
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/Booking'
 *     responses:
 *       '200':
 *         description: Successfully updated a booking
 *         content:
 *           application/json:
 *             schema:
 *            $ref: '#/components/schemas/Booking'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Resource not found
 *       '400':
 *         description: Bad request
 */
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
    } else if (
      (!assignedEmployeeInDB && userIsEmployee) ||
      (!assignedEmployeeInDB && userIsSupervisor)
    ) {
      return userId;
      // loggedin employee can remove himself or super visor can remove any one
    } else if (
      (userIsEmployee && assignedEmployeeInDB === userId) ||
      userIsSupervisor
    ) {
      return "";
    } else if (
      userIsEmployee &&
      assignedEmployeeInDB &&
      assignedEmployeeInDB !== userId
    ) {
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

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Access all Bookings
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully accessed all protected resources
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Booking'

 *       '401':
 *         description: Unauthorized
 */
bookingsRouter.get("/", auth, async (request, response, next) => {
  const bookings = await Booking.find({})
    .populate("user", {
      firstName: 1,
      lastName: 1,
    })
    .populate("comments", { comment: 1 });
  const user = await User.findById(request.user);
  if (!user) {
    response.json(404).end();
  }
  response.json(bookings).status(200);
  next();
});

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Access a single Booking by ID using Bearer token
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          $ref: '#/components/schemas/Booking'
 *     responses:
 *       '200':
 *         description: Successfully accessed a single protected resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Resource not found
 */
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
/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete a Booking by ID using Bearer token
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Successfully deleted a booking
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Resource not found
 */

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
