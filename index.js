const app = require("./app.js");
const { PORT } = require("./utils/config.js");

app.listen(PORT);
console.log(`server running on ${PORT}`);
