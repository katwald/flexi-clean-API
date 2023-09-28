const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

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

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("bookings", {
    title: 1,
    author: 1,
    url: 1,
    comments: 1,
  });
  response.json(users);
});

module.exports = usersRouter;
