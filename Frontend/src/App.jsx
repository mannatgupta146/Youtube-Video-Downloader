import React from 'react';
import Downloader from './components/Downloader';
import './index.css';

function App() {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-logo">YT<span>MP4</span></div>
        <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 'bold' }}>Premium v2.0</div>
      </nav>

      <main>
        <div className="hero-section">
          <h1 className="hero-title">Download YouTube in HQ & MP3 Instantly</h1>
          <p className="hero-subtitle">The fastest, completely free, and premium downloader with zero limits. Just paste your link below and grab your 1080p videos or 320kbps MP3s.</p>
        </div>

        <div className="downloader-wrapper">
          <Downloader />
        </div>

        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-desc">Our backend parses and extracts YouTube metadata within milliseconds without breaking a sweat.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎶</div>
              <h3 className="feature-title">HQ Audio Extraction</h3>
              <p className="feature-desc">Not just videos, you can easily extract crystal clear M4A/MP3 directly to your local files.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3 className="feature-title">Multiple Resolutions</h3>
              <p className="feature-desc">Choose from perfectly mapped 2160p, 1440p, 1080p, 720p, or 360p formats with exact file sizes so you know what you're downloading.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 YTMP4 Premium. Designed for aesthetic and functionality.</p>
      </footer>
    </div>
  );
}

export default App;