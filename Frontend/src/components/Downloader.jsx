import React, { useState } from 'react';
import axios from 'axios';

function Downloader() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getThumbnail = (videoUrl) => {
  if (!videoUrl) return "https://via.placeholder.com/120x80?text=No+URL";
  
  try {
    // Ye regex har tarah ke YT links se ID nikal lega
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    return videoId 
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` 
      : "https://via.placeholder.com/120x80?text=Invalid+ID";
  } catch (e) {
    return "https://via.placeholder.com/120x80?text=Error";
  }
};

  // 2. File ko .mp4 extension ke saath force download karne ka function
  const triggerDownload = (fileUrl, title) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    // Browser ko batana ki file ka naam kya rakhen aur extension .mp4 ho
    const fileName = title ? `${title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp4` : "video_download.mp4";
    link.setAttribute("download", fileName);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Backend API call logic
  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setData(null);

    try {
      // Apne backend endpoint ko hit karna
      const response = await axios.get(`http://localhost:3000/api/youtube/download`, {
        params: { url: url }
      });

      if (response.data.success) {
        setData(response.data);
      } else {
        alert("Backend Error: " + response.data.error);
      }
    } catch (err) {
      console.error("Frontend Error:", err);
      alert("Oops! Server se connect nahi ho paya. Check kijiye ki Backend chal raha hai ya nahi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-container">
      <h1 className="logo-text">YT<span>MP4</span></h1>
      <p className="sub-text">Premium YouTube Video Downloader</p>
      
      <form onSubmit={handleDownload}>
        <div className="input-wrapper">
          <input
            type="text"
            className="custom-input"
            placeholder="Paste YouTube Link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <button className="glow-button" type="submit" disabled={loading}>
          {loading ? "Processing Video..." : "Get Download Link"}
        </button>
      </form>

      {/* Result Display Area */}
      {data && (
        <div className="result-box">
          <img src={getThumbnail(url)} alt="thumbnail" className="thumb-img" />
          <div className="info-content">
            <p className="v-title" title={data.title}>
              {data.title || "Your Video is Ready"}
            </p>
            {/* Direct <a> tag ke bajaye hum custom function use kar rahe hain */}
            <button 
              onClick={() => triggerDownload(data.download, data.title)} 
              className="dl-link"
              style={{ border: 'none', cursor: 'pointer' }}
            >
              Download MP4 📥
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Downloader;