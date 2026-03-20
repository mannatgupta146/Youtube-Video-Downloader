require('dotenv').config();
const express = require("express");
const cors = require("cors");
const youtubeRoutes = require("./routes/youtubeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// UptimeRobot ko 200 OK response bhejne ke liye ping route
app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/youtube", youtubeRoutes);

module.exports = app