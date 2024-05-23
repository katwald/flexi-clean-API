const app = require("./app.js");
const { PORT } = require("./utils/config.js");
const port = process.env.PORT;
app.listen(port || PORT || 3001);
console.log(`server running on ${port}`);
