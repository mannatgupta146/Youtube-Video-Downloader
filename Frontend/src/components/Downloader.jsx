import React, { useState } from 'react';
import axios from 'axios';

function Downloader() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mediaView, setMediaView] = useState(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("yt_history");
    return saved ? JSON.parse(saved) : [];
  });

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

  // 2. File ko format ke hisaab se download karne ka function
  const triggerDownload = (fileUrl, title, type = "video") => {
    const link = document.createElement("a");
    link.href = fileUrl;
    // Extension decide karna
    let ext = ".mp4";
    if (type === "image") ext = ".jpg";
    else if (type === "audio") ext = ".m4a";

    const fileName = title ? `${title.replace(/[^a-zA-Z0-9 ]/g, "")}${ext}` : `youtube_download${ext}`;
    link.setAttribute("download", fileName);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Backend API call logic
  const fetchDownload = async (targetUrl) => {
    setLoading(true);
    setData(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      
      const response = await axios.get(`${API_URL}/api/youtube/download`, {
        params: { url: targetUrl }
      });

      if (response.data.success) {
        setData(response.data);
        setMediaView(null);
        
        if (response.data.fullResponse?.videoLinks?.length > 0) {
          setSelectedVideoUrl(response.data.fullResponse.videoLinks[0].url);
        } else {
          setSelectedVideoUrl(response.data.download || '');
        }

        // Save to history
        const newItem = {
          url: targetUrl,
          title: response.data.title,
          thumbnail: response.data.fullResponse?.thumbnail || getThumbnail(targetUrl),
          channel: response.data.fullResponse?.channel || "Unknown",
        };
        
        setHistory(prev => {
          const filtered = prev.filter(item => item.url !== targetUrl);
          const newHistory = [newItem, ...filtered].slice(0, 50); // Keep up to 50 videos
          localStorage.setItem("yt_history", JSON.stringify(newHistory));
          return newHistory;
        });

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

  const handleDownload = (e) => {
    e.preventDefault();
    fetchDownload(url);
  };

  return (
    <div className="glass-container">
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
      {data && mediaView !== null ? (
        <div className="result-box" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
          <button 
            onClick={() => setMediaView(null)}
            style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ⬅ Back to Main Page
          </button>
          
          {mediaView === 'video' && (
            <>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Watching Video 🎥</h3>
              <video controls src={selectedVideoUrl} style={{ width: '100%', outline: 'none', borderRadius: '12px', maxHeight: '350px', background: 'black' }} autoPlay />
              <button 
                  onClick={() => triggerDownload(selectedVideoUrl, (data.title || "video") + " HD", "video")} 
                  className="dl-link"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              >
                  Download Video 📥
              </button>
            </>
          )}

          {mediaView === 'audio' && (
            <>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Listening to Audio 🎵</h3>
              <audio controls src={data.fullResponse?.audioLink} style={{ width: '100%', outline: 'none', borderRadius: '12px' }} autoPlay />
              <button 
                  onClick={() => triggerDownload(data.fullResponse.audioLink, (data.title || "video") + " Audio", "audio")} 
                  className="dl-link"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              >
                  Download Audio 📥
              </button>
            </>
          )}

          {mediaView === 'thumbnail' && (
            <>
              <img src={data.fullResponse?.thumbnail} alt="HD Thumbnail" style={{ width: '100%', borderRadius: '12px', maxHeight: '350px', objectFit: 'contain', backgroundColor: 'rgba(0,0,0,0.4)', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }} />
              <button 
                  onClick={() => triggerDownload(data.fullResponse.thumbnail, (data.title || "video") + " Thumbnail", "image")} 
                  className="dl-link"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              >
                  Download HQ Image 📥
              </button>
            </>
          )}
        </div>
      ) : data && mediaView === null ? (
        <div className="result-box">
          <img src={data.fullResponse?.thumbnail || getThumbnail(url)} alt="thumbnail" className="thumb-img" />
          <div className="info-content">
            <p className="v-title" title={data.title}>
              {data.title || "Your Video is Ready"}
            </p>
            
            {/* Show extra metadata if available */}
            {data.fullResponse?.channel && (
               <div style={{ fontSize: '0.9rem', color: '#b2bec3', marginTop: '5px', marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                 <span style={{ fontWeight: 'bold', color: '#fff' }}>👤 {data.fullResponse.channel}</span>
                 {data.fullResponse.views && (
                   <span>👁️ {parseInt(data.fullResponse.views).toLocaleString()} views</span>
                 )}
                 {data.fullResponse.likes && (
                   <span>👍 {parseInt(data.fullResponse.likes).toLocaleString()} likes</span>
                 )}
                 {data.fullResponse.date && (
                   <span>📅 {data.fullResponse.date}</span>
                 )}
               </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              
              {data.fullResponse?.videoLinks && data.fullResponse.videoLinks.length > 0 ? (
                <div style={{ display: 'flex', flex: 1, gap: '5px', minWidth: '120px' }}>
                  <select
                    value={selectedVideoUrl}
                    onChange={(e) => setSelectedVideoUrl(e.target.value)}
                    style={{ padding: '8px', borderRadius: '5px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', flex: 0.4, outline: 'none', cursor: 'pointer' }}
                  >
                    {data.fullResponse.videoLinks.map((vid, idx) => (
                      <option key={idx} value={vid.url} style={{ color: 'black' }}>
                        {vid.quality || 'Unknown'} {vid.size ? `(${vid.size})` : ''}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setMediaView('video')} 
                    className="dl-link"
                    style={{ border: 'none', cursor: 'pointer', flex: 0.6, display: 'flex', justifyContent: 'center' }}
                  >
                    Watch & Download MP4 🎥
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setMediaView('video')} 
                  className="dl-link"
                  style={{ border: 'none', cursor: 'pointer', flex: 1, minWidth: '120px', display: 'flex', justifyContent: 'center' }}
                >
                  Watch & Download MP4 🎥
                </button>
              )}

              {data.fullResponse?.audioLink && (
                <button 
                  onClick={() => setMediaView('audio')} 
                  className="dl-link"
                  style={{ border: 'none', cursor: 'pointer', flex: 1, backgroundColor: '#00b894', color: 'white', minWidth: '120px', display: 'flex', justifyContent: 'center' }}
                >
                  Listen Audio 🎵 {data.fullResponse?.audioSize ? `(${data.fullResponse.audioSize})` : ''}
                </button>
              )}
              
              {data.fullResponse?.thumbnail && (
                <button 
                  onClick={() => setMediaView('thumbnail')} 
                  className="dl-link"
                  style={{ border: 'none', cursor: 'pointer', flex: 1, backgroundColor: '#6c5ce7', color: 'white', minWidth: '120px', display: 'flex', justifyContent: 'center' }}
                >
                  HD Thumbnail 🖼️
                </button>
              )}
            </div>
            
            <button 
              onClick={() => { setData(null); setUrl(''); }}
              style={{
                width: '100%', marginTop: '20px', padding: '10px',
                background: 'transparent', border: '1px solid #262626',
                color: '#a1a1aa', borderRadius: '8px', cursor: 'pointer',
                fontSize: '0.9rem'
              }}
              onMouseOver={(e) => { e.target.style.background = '#171717'; e.target.style.color = '#fff'; }}
              onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#a1a1aa'; }}
            >
              ⬅ Go Back & Download Another
            </button>

          </div>
        </div>
      ) : null}

      {/* History Section */}
      {history.length > 0 && (
        <div className="history-section" style={{ marginTop: '30px', textAlign: 'left' }}>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
            🕒 Recent Downloads
          </h3>
          <div className="custom-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto', paddingRight: '5px' }}>
            {history.map((item, index) => (
              <div 
                key={index}
                onClick={() => {
                  setUrl(item.url);
                  fetchDownload(item.url);
                }}
                title="Click to download again"
                style={{
                  display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', 
                  backgroundColor: 'transparent', borderRadius: '8px',
                  cursor: 'pointer', border: '1px solid #262626'
                }}
              >
                <img src={item.thumbnail} alt="thumb" style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '5px' }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ color: '#fff', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                    {item.title}
                  </p>
                  <p style={{ color: '#b2bec3', fontSize: '0.75rem', margin: '3px 0 0 0' }}>{item.channel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Downloader;