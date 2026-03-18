import React from 'react';
import Downloader from './components/Downloader';
import './index.css';

function App() {
  return (
    <div className="main-wrapper">
      {/* Aap yahan Navbar bhi add kar sakte hain baad mein */}
      <Downloader />
      {/* Footer yahan aa sakta hai */}
    </div>
  );
}

export default App;