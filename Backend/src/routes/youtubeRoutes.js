const express = require("express");
const {
  videoInfoController,
  downloadController,
} = require("../controllers/youtubeController");

const router = express.Router();

router.get("/info", videoInfoController);
router.get("/download", downloadController);

module.exports = router