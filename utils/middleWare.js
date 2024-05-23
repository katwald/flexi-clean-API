const jwt = require("jsonwebtoken");

const auth = (request, response, next) => {
  const authorization = request.headers["authorization"];
  console.log("auther---", request.headers, authorization);
  const extractedToken =
    authorization && authorization.startsWith("Bearer ")
      ? authorization.replace("Bearer ", "")
      : null;
  const decodedToken = jwt.verify(extractedToken, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  request.user = decodedToken.id;
  next();
};

module.exports = { auth };
