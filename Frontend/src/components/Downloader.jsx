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
    try {
      const m = videoUrl?.match(/^.*(youtu.be\/|v\/|watch\?v=|\&v=)([^#\&\?]*).*/);
      return m && m[2].length === 11
        ? `https://img.youtube.com/vi/${m[2]}/mqdefault.jpg` : '';
    } catch { return ''; }
  };

  const triggerDownload = (fileUrl, title, type = "video") => {
    const ext = type === "image" ? ".jpg" : type === "audio" ? ".m4a" : ".mp4";
    const a = document.createElement("a");
    a.href = fileUrl;
    a.setAttribute("download", `${(title || "download").replace(/[^a-zA-Z0-9 ]/g, "")}${ext}`);
    a.setAttribute("target", "_blank");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const fetchDownload = async (targetUrl) => {
    setLoading(true); setData(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await axios.get(`${API_URL}/api/youtube/download`, { params: { url: targetUrl } });
      if (res.data.success) {
        setData(res.data);
        setMediaView(null);
        const links = res.data.fullResponse?.videoLinks;
        setSelectedVideoUrl(links?.length ? links[0].url : res.data.download || '');
        const item = {
          url: targetUrl,
          title: res.data.title,
          thumbnail: res.data.fullResponse?.thumbnail || getThumbnail(targetUrl),
          channel: res.data.fullResponse?.channel || "Unknown",
        };
        setHistory(prev => {
          const next = [item, ...prev.filter(x => x.url !== targetUrl)].slice(0, 50);
          localStorage.setItem("yt_history", JSON.stringify(next));
          return next;
        });
      } else {
        alert("Error: " + res.data.error);
      }
    } catch (err) {
      console.error("Frontend Error:", err);
      alert("Oops! Server se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  const fr = data?.fullResponse;

  return (
    <div className="glass-container">

      {/* ── SEARCH FORM ── */}
      <form onSubmit={(e) => { e.preventDefault(); fetchDownload(url); }}>
        <div className="input-wrapper">
          <input
            className="custom-input"
            type="text"
            placeholder="Paste YouTube link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <button className="glow-button" type="submit" disabled={loading}>
          {loading ? "⏳ Fetching..." : "⬇️  Get Download Link"}
        </button>
      </form>

      {/* ── MEDIA VIEW ── */}
      {data && mediaView && (
        <div className="media-box">
          <button className="back-btn" onClick={() => setMediaView(null)}>← Back</button>
          <p className="media-label">
            {mediaView === 'video' && '🎥 Watch & Download'}
            {mediaView === 'audio' && '🎵 Listen & Download'}
            {mediaView === 'thumbnail' && '🖼️ HD Thumbnail'}
          </p>

          {mediaView === 'video' && (
            <>
              <video controls autoPlay src={selectedVideoUrl}
                style={{ width: '100%', borderRadius: '10px', maxHeight: '300px', background: '#000', outline: 'none' }} />
              <button className="dl-btn dl-btn--red"
                onClick={() => triggerDownload(selectedVideoUrl, data.title + " HD", "video")}>
                ⬇️ Download Video
              </button>
            </>
          )}

          {mediaView === 'audio' && (
            <>
              <audio controls autoPlay src={fr?.audioLink}
                style={{ width: '100%', outline: 'none', borderRadius: '8px' }} />
              <button className="dl-btn dl-btn--green"
                onClick={() => triggerDownload(fr.audioLink, data.title + " Audio", "audio")}>
                ⬇️ Download Audio
              </button>
            </>
          )}

          {mediaView === 'thumbnail' && (
            <>
              <img src={fr?.thumbnail} alt="Thumbnail"
                style={{ width: '100%', borderRadius: '10px', objectFit: 'contain', background: '#0a0a0a', maxHeight: '280px' }} />
              <button className="dl-btn dl-btn--purple"
                onClick={() => triggerDownload(fr.thumbnail, data.title + " Thumbnail", "image")}>
                ⬇️ Download Image
              </button>
            </>
          )}
        </div>
      )}

      {/* ── RESULT CARD ── */}
      {data && !mediaView && (
        <div className="result-card">
          {/* Full-width thumbnail */}
          <img
            className="result-card__thumb"
            src={fr?.thumbnail || getThumbnail(url)}
            alt="thumbnail"
            onError={(e) => { e.target.src = getThumbnail(url); e.target.onerror = null; }}
          />

          <div className="result-card__body">
            {/* Title */}
            <p className="result-card__title" title={data.title}>
              {data.title || "Your Video is Ready"}
            </p>

            {/* Meta chips */}
            <div className="meta-row">
              {fr?.channel && <span className="meta-chip">👤 {fr.channel}</span>}
              {fr?.views   && <span className="meta-chip">👁️ {Number(fr.views).toLocaleString()}</span>}
              {fr?.likes   && <span className="meta-chip">👍 {Number(fr.likes).toLocaleString()}</span>}
              {fr?.date    && <span className="meta-chip">📅 {fr.date}</span>}
            </div>

            {/* Download buttons */}
            <div className="dl-stack">
              {/* Video */}
              <div className="dl-row">
                {fr?.videoLinks?.length > 0 && (
                  <select
                    className="quality-select"
                    value={selectedVideoUrl}
                    onChange={(e) => setSelectedVideoUrl(e.target.value)}
                  >
                    {fr.videoLinks.map((v, i) => (
                      <option key={i} value={v.url}>
                        {v.quality}{v.size ? ` (${v.size})` : ''}
                      </option>
                    ))}
                  </select>
                )}
                <button className="dl-btn dl-btn--red" onClick={() => setMediaView('video')}>
                  🎬 Watch &amp; Download
                </button>
              </div>

              {/* Audio + Thumbnail */}
              {(fr?.audioLink || fr?.thumbnail) && (
                <div className="dl-row">
                  {fr?.audioLink && (
                    <button className="dl-btn dl-btn--green" onClick={() => setMediaView('audio')}>
                      🎵 Audio{fr.audioSize ? ` (${fr.audioSize})` : ''}
                    </button>
                  )}
                  {fr?.thumbnail && (
                    <button className="dl-btn dl-btn--purple" onClick={() => setMediaView('thumbnail')}>
                      🖼️ Thumbnail
                    </button>
                  )}
                </div>
              )}

              <button className="btn-ghost" onClick={() => { setData(null); setUrl(''); }}>
                ← Download Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORY ── */}
      {history.length > 0 && (
        <div className="history-section">
          <p className="history-title">🕒 Recent</p>
          <div className="custom-scroll" style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {history.map((item, i) => (
              <div key={i} className="history-item"
                onClick={() => { setUrl(item.url); fetchDownload(item.url); }}
                title="Click to re-download">
                <img src={item.thumbnail} alt=""
                  style={{ width: '68px', height: '42px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0, border: '1px solid var(--border)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--t3)', margin: '2px 0 0' }}>{item.channel}</p>
                </div>
                <span style={{ color: 'var(--t3)', fontSize: '0.8rem' }}>↗</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Downloader;