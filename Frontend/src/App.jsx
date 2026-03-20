import React from 'react';
import Downloader from './components/Downloader';
import './index.css';

function App() {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-logo">YT<span>MP4</span></div>
        <div className="nav-badge">v2.0 Free</div>
      </nav>

      <main>
        <div className="hero-section">
          <div className="hero-eyebrow">⚡ No limits · No signup · Always free</div>
          <h1 className="hero-title">
            Download YouTube<br />
            <span className="gradient-text">Videos &amp; Audio</span>
          </h1>
          <p className="hero-subtitle">
            Paste any YouTube link to instantly get 1080p downloads, 
            MP3 audio, and HD thumbnails, completely free.
          </p>
        </div>

        <div className="downloader-wrapper">
          <Downloader />
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 YTMP4 · Built for speed &amp; quality</p>
      </footer>
    </div>
  );
}

export default App;