require("dotenv");
const connectDB = require("./utils/db");

const app = require("./app");

const PORT = process.env.PORT || 3000 || 3001;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Started Express app on http://localhost:${PORT}`);
});
