const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Authenticate a user and get JWT Bearer token
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: JWT Bearer token generated successfully
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
 *       '401':
 *         description: Unauthorized
 */

loginRouter.post("/", async (request, response) => {
  const { email, password } = request.body;
  console.log("email", email, password);
  const user = await User.findOne({ email });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid email or password",
    });
  }
  const userForToken = {
    email: user.email,
    id: user._id,
  };
  const token = jwt.sign(userForToken, process.env.SECRET);
  response.status(200).send({
    token,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });
});
module.exports = loginRouter;
