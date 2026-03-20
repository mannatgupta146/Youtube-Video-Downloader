# 🚀 YTMP4 - Premium YouTube Video Downloader

Welcome to **YTMP4**! This is a fast, clean, and premium web application that allows you to download YouTube videos and audio (MP3/M4A) directly to your device. It is built using modern web technologies and provides a beautiful SaaS-like User Interface.

## ✨ Features

- **🎬 High-Quality Video Downloads**: Choose exactly what resolution you want (1080p, 720p, 360p, etc.).
- **🎵 MP3 & Audio Extraction**: Instantly extract crystal-clear music/audio without downloading the heavy video file.
- **📊 Exact File Sizes**: See exactly how many Megabytes (MB) a file is before you click download.
- **🖼️ High-Res Thumbnails & Metadata**: View the video's Channel Name, Upload Date, Total Views, and Likes right on the screen.
- **🕒 Recent Downloads History**: The app automatically saves your last 5 downloaded videos locally so you don't lose them!
- **💎 Premium Glassmorphism UI**: Beautiful, dark-mode styling that looks like a professional startup landing page.
- **⚡ Super Fast**: Powered by a robust Node.js backend using RapidAPI.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Vanilla CSS (Glassmorphism design)
- **Backend**: Node.js, Express.js, Axios
- **API**: YouTube Media Downloader (via RapidAPI)

---

## 💻 How to Run Locally

If you want to run this project on your own computer, follow these simple steps:

### 1. Clone the project
Download the code to your PC and open it in your code editor (like VS Code).

### 2. Setup the Backend
1. Open a terminal and go to the `Backend` folder:
   ```bash
   cd Backend
   ```
2. Install the required packages:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `Backend` folder and add your RapidAPI key:
   ```env
   PORT=3000
   RAPID_API_KEY=your_api_key_here
   RAPID_API_HOST=youtube-media-downloader.p.rapidapi.com
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Setup the Frontend
1. Open a **new** terminal and go to the `Frontend` folder:
   ```bash
   cd Frontend
   ```
2. Install the required packages:
   ```bash
   npm install
   ```
3. Start the frontend React app:
   ```bash
   npm run dev
   ```

🎉 **You are done!** Open `http://localhost:5173` in your browser and start downloading!

---

## 🌐 Deploying to the Web

If you want to host this for free on the internet:
1. Deploy the **Backend** folder to [Render.com](https://render.com).
2. Go to your **Frontend** folder, create a `.env` file, and add your new Render URL: `VITE_API_URL=https://your-backend-url.onrender.com`
3. Deploy the **Frontend** folder to [Vercel.com](https://vercel.com).

> *Made with ❤️ by an awesome developer.*
