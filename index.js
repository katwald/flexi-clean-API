const app = require("./app.js");
const { PORT } = require("./utils/config.js");

app.listen(PORT || 10000);
console.log(`server running on ${PORT}`);
