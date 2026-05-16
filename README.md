# VoiceToText 🎤

Fast and secure audio transcription PWA using Groq's Whisper API. Record or upload audio files and get instant transcriptions in 90+ languages.

**Live Demo:** https://stanasko.github.io/voicetotext/

## ✨ Features

### Core Functionality
- 🎙️ **Real-time Audio Recording** - Record directly from your microphone
- 📤 **Drag & Drop Upload** - Upload MP3, WAV, WebM, M4A files (up to 25MB)
- ⚡ **Instant Transcription** - Powered by Groq's ultra-fast Whisper model
- 🌍 **Multi-language Support** - Automatic language detection (90+ languages)
- 📝 **Text Editor** - Edit transcriptions with character/word count
- 💾 **Local Storage** - All data stored locally on your device
- 📋 **History Management** - Access previous transcriptions anytime
- 💾 **Export to .txt** - Download transcriptions as text files

### Advanced Features
- 🌙 **Dark/Light Mode** - Toggle between themes
- ⌨️ **Keyboard Shortcuts**
  - `Ctrl+C` / `Cmd+C` - Copy transcript
  - `Ctrl+E` / `Cmd+E` - Export transcript
  - `Ctrl+D` / `Cmd+D` - Delete transcript
  - `Ctrl+Shift+S` / `Cmd+Shift+S` - Open settings
- 📊 **Rate Limit Display** - Real-time API usage tracking
- 🔒 **Privacy-First** - API key stored locally only
- 📱 **PWA Features** - Installable on all devices
- 🔌 **Offline Support** - Access your history offline

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Free Groq API key from [console.groq.com](https://console.groq.com)

### Installation

#### Option 1: Online (Recommended)
Visit **https://stanasko.github.io/voicetotext/** and start using immediately.

#### Option 2: Install as PWA
1. Visit the live demo link above
2. Click "Install" button in your browser
3. Use like a native app on iOS, Android, Windows, or macOS

#### Option 3: Run Locally
```bash
# Clone the repository
git clone https://github.com/stanasko/voicetotext.git
cd voicetotext

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔐 Security & Privacy

Your API key is **never sent to any server except Groq's**:
- ✅ Stored locally in browser (localStorage)
- ✅ No backend server involved
- ✅ Direct API calls from browser to Groq
- ✅ Full HTTPS encryption
- ✅ You control your data completely

## 📊 API Usage

### Free Tier Limits (Groq)
- **2,000 requests per day**
- **7,200 audio seconds per hour** (~2 hours per hour)
- **25MB maximum file size**
- No credit card required

The app displays real-time usage stats via HTTP headers.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB (history) + localStorage (settings)
- **Audio**: Web Audio API
- **API**: Groq Whisper
- **PWA**: Service Workers + Web Manifest
- **Deployment**: GitHub Pages

## 📖 How to Use

### Step 1: Add API Key
1. Click ⚙️ (Settings) in top-right
2. Go to https://console.groq.com to get your free API key
3. Paste your key and save

### Step 2: Record or Upload
- **Record**: Click "Start Recording" and speak
- **Upload**: Drag & drop a file or click "Browse Files"

### Step 3: Transcribe
Click "Stop & Transcribe" to send audio to Groq

### Step 4: Edit & Export
- Edit the text directly
- Copy to clipboard
- Export as .txt file
- Delete from history if no longer needed

## 🎯 Use Cases

- 📝 Meeting transcriptions
- 🎓 Lecture notes
- 🎙️ Podcast transcripts
- 📞 Call recordings
- 🗣️ Language learning
- 📋 Documentation

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` / `Cmd+C` | Copy transcript |
| `Ctrl+E` / `Cmd+E` | Export as .txt |
| `Ctrl+D` / `Cmd+D` | Delete transcript |
| `Ctrl+Shift+S` / `Cmd+Shift+S` | Open settings |

## 🌐 Browser Support

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14.1+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Android Chrome)

## 📦 Installation Size

- **HTML/CSS/JS Bundle**: ~360KB (gzipped: ~115KB)
- **No external CDNs** - everything bundled
- **Fast loading** on 3G+ connections

## 🔄 Updates & Deployment

This app uses GitHub Actions for automatic deployment:
- Every push to `main` branch triggers build
- Automatically deployed to GitHub Pages
- Zero downtime updates

## 📄 License

MIT License - Feel free to use and modify

## 🤝 Contributing

Found a bug or have a feature request? 
- Open an issue on [GitHub](https://github.com/stanasko/voicetotext/issues)
- Fork and submit a pull request

## 📞 Support

- **Groq API Issues**: https://community.groq.com
- **Bug Reports**: GitHub Issues
- **Feature Requests**: GitHub Discussions

## 🙏 Acknowledgments

- **Groq** for the incredibly fast Whisper API
- **React** and **Vite** for the awesome developer experience
- **Tailwind CSS** for beautiful styling
- **OpenAI** for Whisper model

---

**Made with ❤️ for fast, secure, and private audio transcription**

Visit: https://stanasko.github.io/voicetotext/
