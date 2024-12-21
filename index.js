const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoutes");
const totoRoute = require("./routes/todoRoute");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(cors());

/* Routes */
app.use("/api/auth", authRoute);
app.use("/api/todo", totoRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started on port 5000");
});
