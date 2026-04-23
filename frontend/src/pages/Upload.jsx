// Upload.jsx
import { useState } from 'react';
import axios from 'axios';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [shareUrls, setShareUrls] = useState([]);
  const [enablePassword, setEnablePassword] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFilesSelect = (selectedFiles) => {
    if (selectedFiles?.length) {
      setFiles(prev => [...prev, ...Array.from(selectedFiles)]);
    }
  };

  const removeFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragActive(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFilesSelect(e.dataTransfer.files);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    const newShareUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('expiry', e.target.expiry.value);
      formData.append('limit', e.target.limit.value);
      formData.append('password', enablePassword ? (e.target.password?.value || '') : '');

      try {
        const res = await axios.post('http://localhost:5000/api/upload', formData);
        newShareUrls.push({ filename: file.name, share_url: res.data.share_url });
      } catch (err) {
        alert(`Failed to upload ${file.name}`);
      }
    }

    setShareUrls(newShareUrls);
    setFiles([]);
    setEnablePassword(false);
    setUploading(false);
  };

  const copyLink = (url) => {
    navigator.clipboard.writeText(url);
    alert('✅ Share link copied successfully!');
  };

  return (
    <div className="min-h-screen bg-[#0a0a2a] pt-12 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            File Dropper
          </h1>
          <p className="text-slate-400 text-xl mt-3">Secure • Fast • Professional File Sharing</p>
        </div>

        <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Drag & Drop Area */}
          <div 
            className={`bg-[#1e2937] border-2 border-dashed rounded-3xl p-16 text-center transition-all min-h-[480px] flex flex-col items-center justify-center
              ${dragActive ? 'border-cyan-400 bg-cyan-950/40 scale-[1.02]' : 'border-cyan-500/50'}
              ${files.length > 0 ? 'border-emerald-400' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input type="file" id="fileInput" className="hidden" multiple onChange={(e) => handleFilesSelect(e.target.files)} />
            
            <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
              <div className="text-8xl mb-8">📤</div>
              <p className="text-3xl font-semibold mb-3">
                {files.length > 0 ? `${files.length} files selected` : 'Drag & drop files here'}
              </p>
              <p className="text-slate-400">or click to browse • Multiple files supported</p>
            </label>

            {files.length > 0 && (
              <div className="mt-10 w-full max-h-64 overflow-y-auto space-y-3 pr-4">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center bg-[#0f172a] p-4 rounded-2xl border border-emerald-400/30">
                    <div className="flex-1 truncate">
                      <p className="text-white font-medium truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button type="button" onClick={() => removeFile(i)} className="text-red-400 hover:text-red-500 text-2xl px-3">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sharing Settings */}
          <div className="bg-[#1e2937] rounded-3xl p-10">
            <h3 className="text-3xl font-semibold mb-8">Sharing Settings</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-lg font-medium">Password Protection</label>
                  <input type="checkbox" checked={enablePassword} onChange={() => setEnablePassword(!enablePassword)} className="w-6 h-6 accent-cyan-400" />
                </div>
                {enablePassword && (
                  <input type="password" name="password" placeholder="Enter password (same for all files)" className="w-full bg-[#0f172a] border border-cyan-400 rounded-2xl p-5" required />
                )}
              </div>

              <div>
                <label className="block text-lg mb-3">Expiry Time</label>
                <select name="expiry" defaultValue="7" className="w-full bg-[#0f172a] border border-cyan-400 rounded-2xl p-5">
                  <option value="1">1 Day</option>
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-lg mb-3">Download Limit</label>
                <select name="limit" defaultValue="5" className="w-full bg-[#0f172a] border border-cyan-400 rounded-2xl p-5">
                  <option value="5">5 Downloads</option>
                  <option value="10">10 Downloads</option>
                  <option value="0">Unlimited</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={uploading || files.length === 0}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 py-6 text-2xl font-semibold rounded-3xl mt-8 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
              >
                {uploading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading {files.length} file(s)...
                  </>
                ) : files.length === 0 
                  ? "Select Files to Upload" 
                  : `Upload ${files.length} File${files.length > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </form>

        {/* Success Section */}
        {shareUrls.length > 0 && (
          <div className="mt-16 bg-gradient-to-br from-emerald-900 to-slate-900 border border-emerald-400 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-emerald-300 mb-8 flex items-center gap-4">
              🎉 Upload Completed Successfully!
            </h2>
            <div className="space-y-6">
              {shareUrls.map((item, i) => (
                <div key={i} className="bg-[#0f172a] p-7 rounded-2xl flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{item.filename}</p>
                    <p className="text-cyan-300 text-sm break-all mt-2 font-mono">{item.share_url}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => copyLink(item.share_url)} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl text-sm">📋 Copy</button>
                    <a href={item.share_url} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white text-black hover:bg-cyan-400 hover:text-white rounded-2xl text-sm font-semibold">Open in New Tab →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}