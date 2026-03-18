const {
  getVideoInfo,
  downloadVideo,
} = require("../services/youtubeService");

// 🛠️ Helper function to extract ID from URL
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

/* ================= VIDEO INFO ================= */
async function videoInfoController(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ success: false, error: "URL is required" });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ success: false, error: "Invalid YouTube URL" });
    }

    // Ab hum service ko ID bhej rahe hain, URL nahi
    const data = await getVideoInfo(videoId);

    res.json({ success: true, data });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/* ================= DOWNLOAD (MP3) ================= */
async function downloadController(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ success: false, error: "URL is required" });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ success: false, error: "Invalid YouTube URL" });
    }

    const data = await downloadVideo(videoId);

    res.json({
      success: true,
      // API ke response ke hisaab se link extract karna
      download: data.link || data.download_url || data.url, 
      title: data.title,
      duration: data.duration,
      fullResponse: data
    });

  } catch (error) {
    console.log("DOWNLOAD ERROR 👉", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  videoInfoController,
  downloadController,
};