const express = require("express");
const cors = require("cors");
const youtubeRoutes = require("./routes/youtubeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/youtube", youtubeRoutes);

module.exports = app