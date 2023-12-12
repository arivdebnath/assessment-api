const mongoose = require("mongoose");
require("dotenv").config();

// connecting database
mongoose.connect(process.env.DATABASE_URL);

// checking the connection
mongoose.connection.once("open", () => {
  console.log("MongoDB Connected Successfully");
});