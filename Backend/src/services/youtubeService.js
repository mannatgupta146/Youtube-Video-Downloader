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
    
    // Extract video links (quality options with file sizes)
    let videoLinks = [];
    let bestVideo = null;
    if (data.videos && data.videos.items && data.videos.items.length > 0) {
      let mp4Audios = data.videos.items.filter(v => v.extension === 'mp4' && v.hasAudio === true);
      
      if (mp4Audios.length > 0) {
        const uniqueQualities = new Map();
        mp4Audios.forEach(v => {
          if (!uniqueQualities.has(v.quality)) {
            uniqueQualities.set(v.quality, v);
          }
        });
        videoLinks = Array.from(uniqueQualities.values()).map(v => ({
          quality: v.quality,
          url: v.url,
          size: v.sizeText || ''
        }));
        bestVideo = mp4Audios[0];
      } else {
        bestVideo = data.videos.items[0];
        videoLinks = [{ quality: bestVideo.quality || 'default', url: bestVideo.url, size: bestVideo.sizeText || '' }];
      }
    }

    // High-res thumbnail nikalna
    let bestThumbnail = null;
    if (data.thumbnails && data.thumbnails.length > 0) {
      // Last item usually sabse badi resolution hoti hai API mein
      bestThumbnail = data.thumbnails[data.thumbnails.length - 1].url;
    }

    // Audio link nikalna (preferably m4a for max compatibility)
    let bestAudio = null;
    if (data.audios && data.audios.items && data.audios.items.length > 0) {
      bestAudio = data.audios.items.find(a => a.extension === 'm4a') || data.audios.items[0];
    }

    return {
      success: true,
      title: data.title,
      link: bestVideo ? bestVideo.url : null,
      videoLinks: videoLinks,
      audioLink: bestAudio ? bestAudio.url : null,
      audioSize: bestAudio ? bestAudio.sizeText : null,
      duration: data.lengthSeconds,
      status: data.errorId,
      thumbnail: bestThumbnail,
      description: data.description,
      views: data.viewCount,
      likes: data.likeCount,
      date: data.publishedTimeText,
      channel: data.channel ? data.channel.name : "Unknown Channel"
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