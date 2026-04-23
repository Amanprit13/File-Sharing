// Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a2a] pt-10 pb-20">
      <div className="max-w-6xl mx-auto text-center px-6">
        {/* Hero Section */}
        <div className="pt-16 pb-12">
          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgb(103,232,249)]">
            Drop. Share.<br />Done.
          </h1>
          
          <p className="text-2xl text-slate-300 mt-8 max-w-3xl mx-auto leading-relaxed">
            The most elegant and secure way to share files.<br />
            Upload once, share instantly with full control.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
          <Link 
            to="/upload"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-12 py-5 rounded-3xl text-2xl font-semibold flex items-center justify-center gap-3 shadow-2xl shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95"
          >
            Upload Files Now →
          </Link>
          
          <Link 
            to="/myfiles"
            className="border-2 border-cyan-400 hover:bg-white/10 px-10 py-5 rounded-3xl text-2xl font-semibold transition-all hover:scale-105"
          >
            View My Files
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-28">
          <h2 className="text-4xl font-semibold mb-12">Built for Speed & Security</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#1e2937] p-10 rounded-3xl hover:scale-105 transition-all border border-cyan-900/50 group">
              <div className="text-6xl mb-6 group-hover:rotate-12 transition">⚡</div>
              <h3 className="text-2xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-slate-400">Optimized infrastructure for instant uploads and downloads</p>
            </div>
            
            <div className="bg-[#1e2937] p-10 rounded-3xl hover:scale-105 transition-all border border-cyan-900/50 group">
              <div className="text-6xl mb-6 group-hover:scale-110 transition">🔒</div>
              <h3 className="text-2xl font-semibold mb-4">Secure Sharing</h3>
              <p className="text-slate-400">Password protection, expiry control and encryption</p>
            </div>
            
            <div className="bg-[#1e2937] p-10 rounded-3xl hover:scale-105 transition-all border border-cyan-900/50 group">
              <div className="text-6xl mb-6 group-hover:rotate-12 transition">⏰</div>
              <h3 className="text-2xl font-semibold mb-4">Complete Control</h3>
              <p className="text-slate-400">Set download limits, expiry dates and track usage</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-28">
          <h2 className="text-4xl font-semibold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#1e2937] p-10 rounded-3xl text-left">
              <div className="text-cyan-400 text-5xl mb-6">1</div>
              <h3 className="text-2xl font-semibold mb-3">Upload Files</h3>
              <p className="text-slate-400">Drag & drop multiple files with optional password protection</p>
            </div>
            <div className="bg-[#1e2937] p-10 rounded-3xl text-left">
              <div className="text-cyan-400 text-5xl mb-6">2</div>
              <h3 className="text-2xl font-semibold mb-3">Get Share Links</h3>
              <p className="text-slate-400">Instant secure links with expiry and download limits</p>
            </div>
            <div className="bg-[#1e2937] p-10 rounded-3xl text-left">
              <div className="text-cyan-400 text-5xl mb-6">3</div>
              <h3 className="text-2xl font-semibold mb-3">Share & Download</h3>
              <p className="text-slate-400">Recipient opens link in any browser and downloads securely</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 bg-gradient-to-br from-[#1e2937] to-[#0f172a] rounded-3xl p-16">
          <h2 className="text-4xl font-semibold mb-6">Ready to Share Securely?</h2>
          <p className="text-slate-300 text-xl mb-10 max-w-xl mx-auto">
            Join thousands who trust File Dropper for fast and safe file sharing.
          </p>
          <Link 
            to="/upload"
            className="inline-block bg-cyan-500 hover:bg-cyan-400 px-12 py-5 rounded-3xl text-2xl font-semibold transition-all hover:scale-105"
          >
            Start Uploading Now
          </Link>
        </div>
      </div>
    </div>
  );
}