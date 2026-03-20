const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

async function testApi() {
  try {
    const res = await axios.get('https://youtube-media-downloader.p.rapidapi.com/v2/video/details', {
      params: { videoId: 'dQw4w9WgXcQ' },
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY,
        'x-rapidapi-host': process.env.RAPID_API_HOST || 'youtube-media-downloader.p.rapidapi.com'
      }
    });
    fs.writeFileSync('api_response.json', JSON.stringify(res.data, null, 2));
    console.log("Success! Saved to api_response.json");
  } catch (err) {
    fs.writeFileSync('api_response.json', JSON.stringify(err.response?.data || err.message, null, 2));
    console.error("Failed");
  }
}

testApi();
