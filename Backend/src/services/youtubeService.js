const axios = require("axios");
require('dotenv').config();

async function getVideoInfo(videoId) {
  try {
    // Force the correct video details endpoint instead of the channel posts endpoint
    const apiUrl = 'https://youtube-media-downloader.p.rapidapi.com/v2/video/details';
    
    const response = await axios.get(apiUrl, {
      params: {
        videoId: videoId,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
      },
    });

    const data = response.data;
    
    // Find the best video format that has audio
    let bestVideo = null;
    if (data.videos && data.videos.items) {
       bestVideo = data.videos.items.find(v => v.hasAudio === true && v.extension === 'mp4');
       if (!bestVideo) {
         // Fallback to any that has audio
         bestVideo = data.videos.items.find(v => v.hasAudio === true);
       }
       if (!bestVideo) {
         // Ultimate fallback just the first one
         bestVideo = data.videos.items[0];
       }
    }

    return {
      success: true,
      title: data.title,
      link: bestVideo ? bestVideo.url : null,
      duration: data.lengthSeconds,
      status: data.errorId
    };

  } catch (error) {
    console.error("RAPID API ERROR 👉", error.response ? error.response.data : error.message);
    throw new Error("Video details fetch karne mein galti hui");
  }
}

// Dono functions ko export karna zaroori hai
// Note: Agar aapne controller mein downloadVideo call kiya hai, toh ye function kaam aayega
async function downloadVideo(videoId) {
    return await getVideoInfo(videoId); 
}

module.exports = { 
    getVideoInfo, 
    downloadVideo 
};