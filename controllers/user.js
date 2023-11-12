const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

/**
 * @swagger
 * name: User
 * description: API endpoints to manage User
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user and get JWT Bearer token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User successfully created, and JWT Bearer token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT Bearer token
 *       '400':
 *         description: Bad request
 */
usersRouter.post("/", async (request, response) => {
  const { firstName, lastName, email, password, role } = request.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  if (password.length < 3) {
    response
      .status(400)
      .json("password should be at least 3 or more character");
  } else {
    const user = new User({ firstName, lastName, email, passwordHash, role });
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  }
});

/**
 *@swagger
 *  /api/users:
 *    get:
 *      summary:  get testing text
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: Test route
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("bookings", {
    venueName: 1,
    bookingStatus: 1,
    cleaningStatus: 1,
    comments: 1,
  });
  response.json(users);
});

module.exports = usersRouter;
