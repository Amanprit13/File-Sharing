// App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import MyFiles from './pages/MyFiles';
import Share from './pages/Share';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a2a] text-white flex flex-col">
        {/* Professional Navbar */}
        <nav className="bg-[#0f172a] border-b border-[#1e3a8a] py-5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/50">
                📤
              </div>
              <div>
                <span className="text-3xl font-bold tracking-tight">File Dropper</span>
                <p className="text-xs text-slate-400 -mt-1">Secure File Sharing</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex items-center gap-10 text-lg font-medium">
              <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
              <Link to="/upload" className="hover:text-cyan-400 transition-colors">Upload</Link>
              <Link to="/myfiles" className="hover:text-cyan-400 transition-colors">My Files</Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/myfiles" element={<MyFiles />} />
            <Route path="/share/:shareId" element={<Share />} />
          </Routes>
        </div>

        {/* Professional Footer */}
        <footer className="bg-[#0f172a] py-12 border-t border-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                📤
              </div>
              <span className="text-2xl font-bold tracking-tight">File Dropper</span>
            </div>
            
            <p className="text-slate-400 text-sm">
              Advanced Secure File Sharing Platform • Built for College Project 2026
            </p>
            <p className="text-slate-500 text-xs mt-6">
              Designed with ❤️ for fast, secure and elegant file sharing experience
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;