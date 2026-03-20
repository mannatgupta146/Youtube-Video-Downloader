import React from 'react';
import Downloader from './components/Downloader';
import './index.css';

function App() {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-logo">YT<span>MP4</span></div>
        <div style={{ color: '#52525b', fontSize: '0.85rem', fontWeight: '500' }}>v2.0</div>
      </nav>

      <main>
        <div className="hero-section">
          <h1 className="hero-title">Download YouTube in HQ & MP3 Instantly</h1>
          <p className="hero-subtitle">The fastest, completely free, and premium downloader with zero limits. Just paste your link below and grab your 1080p videos or 320kbps MP3s.</p>
        </div>

        <div className="downloader-wrapper">
          <Downloader />
        </div>


      </main>

      <footer className="footer">
        <p>© 2026 YTMP4 Premium. Designed for aesthetic and functionality.</p>
      </footer>
    </div>
  );
}

export default App;