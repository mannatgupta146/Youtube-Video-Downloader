const youtubedl = require("youtube-dl-exec");

async function getVideoInfo(videoId) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    // Basic options
    const baseOptions = {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      addHeader: [
        "referer:https://www.google.com/",
        "user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "accept-language:en-US,en;q=0.9",
      ],
    };

    let info;
    try {
      // 1. Try with Chrome cookies (most common on Windows)
      info = await youtubedl(videoUrl, { ...baseOptions, cookiesFromBrowser: "chrome" });
    } catch (err1) {
      if (err1.message.includes("is not signed in") || err1.message.includes("could not find browser")) {
        try {
          // 2. Try with Edge cookies (Windows default)
          info = await youtubedl(videoUrl, { ...baseOptions, cookiesFromBrowser: "edge" });
        } catch (err2) {
          // 3. Fallback to no cookies if browser auth fails or browser not found
          info = await youtubedl(videoUrl, baseOptions);
        }
      } else {
        throw err1;
      }
    }

    const formats = info.formats || [];

    // MP4 muxed (video + audio) formats, sorted best quality first
    const muxedMp4 = formats
      .filter((f) => f.vcodec !== "none" && f.acodec !== "none" && f.ext === "mp4" && f.url)
      .sort((a, b) => (b.height || 0) - (a.height || 0));

    // Deduplicate by height
    const seenHeights = new Set();
    const videoLinks = [];
    for (const f of muxedMp4) {
      const key = f.height || f.format_note || f.format_id;
      if (!seenHeights.has(key)) {
        seenHeights.add(key);
        videoLinks.push({
          quality: f.format_note || `${f.height}p` || "Unknown",
          url: f.url,
          size: f.filesize
            ? `${(f.filesize / 1024 / 1024).toFixed(1)} MB`
            : f.filesize_approx
            ? `~${(f.filesize_approx / 1024 / 1024).toFixed(1)} MB`
            : "",
        });
      }
    }

    const bestVideo = muxedMp4[0] || null;

    // Fallback if no muxed MP4
    let fallbackUrl = null;
    if (!bestVideo) {
      fallbackUrl = formats.filter((f) => f.vcodec !== "none" && f.url)
        .sort((a, b) => (b.height || 0) - (a.height || 0))[0]?.url || null;
    }

    // Best audio-only
    const bestAudio = formats
      .filter((f) => f.vcodec === "none" && f.acodec !== "none" && f.url)
      .sort((a, b) => (b.abr || 0) - (a.abr || 0))[0] || null;

    // Best thumbnail
    const thumbnails = info.thumbnails || [];
    const bestThumbnail = thumbnails.length > 0
      ? thumbnails[thumbnails.length - 1].url
      : info.thumbnail || null;

    return {
      success: true,
      title: info.title,
      link: bestVideo ? bestVideo.url : fallbackUrl,
      videoLinks,
      audioLink: bestAudio ? bestAudio.url : null,
      audioSize: bestAudio?.filesize
        ? `${(bestAudio.filesize / 1024 / 1024).toFixed(1)} MB`
        : null,
      duration: info.duration,
      thumbnail: bestThumbnail,
      description: info.description,
      views: info.view_count,
      likes: info.like_count,
      date: info.upload_date
        ? `${info.upload_date.slice(0,4)}-${info.upload_date.slice(4,6)}-${info.upload_date.slice(6,8)}`
        : null,
      channel: info.uploader || info.channel || "Unknown Channel",
    };
  } catch (error) {
    console.error("yt-dlp ERROR 👉", error.message);
    throw new Error("Video details fetch karne mein galti hui: " + error.message);
  }
}

async function downloadVideo(videoId) {
  return await getVideoInfo(videoId);
}

module.exports = { getVideoInfo, downloadVideo };