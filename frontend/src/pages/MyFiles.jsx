// MyFiles.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function timeAgo(dateString) {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Just now";

  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return Math.floor(seconds / 60) + " min ago";
  if (seconds < 86400) return Math.floor(seconds / 3600) + " hr ago";
  return Math.floor(seconds / 86400) + " days ago";
}

function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return '🖼️';
  if (ext === 'pdf') return '📕';
  if (['doc', 'docx'].includes(ext)) return '📘';
  if (['zip', 'rar', '7z'].includes(ext)) return '📦';
  return '📄';
}

export default function MyFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');

  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/myfiles');
      setFiles(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleOpen = (file) => {
    if (file.password && file.password.trim() !== "") {
      setSelectedFile(file);
      setPassword('');
      setError('');
      setShowPasswordModal(true);
    } else {
      window.open(`http://localhost:5000/api/files/${file.id}/download`, '_blank');
    }
  };

  const handlePasswordDownload = async () => {
    if (!selectedFile) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/download/${selectedFile.share_id}`,
        { password },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.filename;
      link.click();
      setShowPasswordModal(false);
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Wrong password');
    }
  };

  const handleDelete = async (fileId, filename) => {
    if (!window.confirm(`Delete "${filename}" permanently?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/delete/${fileId}`);
      fetchFiles();
    } catch (err) {
      alert('Failed to delete file');
    }
  };

  const copyLink = (url) => {
    navigator.clipboard.writeText(url);
    alert('✅ Share link copied!');
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a2a] flex items-center justify-center text-2xl text-cyan-400">Loading your files...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a2a] pt-12 pb-20">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex justify-between items-end mb-10">
          <h1 className="text-4xl font-bold flex items-center gap-4">
            📁 My Files
          </h1>
          <p className="text-slate-400 text-lg">Total Files: <span className="text-cyan-400 font-semibold">{files.length}</span></p>
        </div>

        <div className="bg-[#1e2937] rounded-3xl p-8 shadow-2xl border border-slate-700">
          {files.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">📁</div>
              <p className="text-3xl font-medium mb-4">No files uploaded yet</p>
              <a href="/upload" className="bg-cyan-500 hover:bg-cyan-400 px-10 py-4 rounded-3xl text-xl font-semibold transition">
                Upload New Files
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-5 font-medium">File Name</th>
                    <th className="text-left py-5 font-medium">Size</th>
                    <th className="text-left py-5 font-medium">Uploaded</th>
                    <th className="text-left py-5 font-medium">Share Link</th>
                    <th className="text-right py-5 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((f) => {
                    const shareUrl = f.share_id ? `http://localhost:5173/share/${f.share_id}` : '';
                    const sizeMB = f.file_size ? (f.file_size / (1024 * 1024)).toFixed(2) + " MB" : "— MB";

                    return (
                      <tr key={f.id} className="border-b border-slate-700 hover:bg-slate-800/70 transition-all group">
                        <td className="py-6 font-medium flex items-center gap-4">
                          <span className="text-2xl">{getFileIcon(f.filename)}</span>
                          <span className="truncate max-w-md">{f.filename}</span>
                        </td>
                        <td className="py-6 text-slate-400 font-medium">{sizeMB}</td>
                        <td className="py-6 text-slate-400">{timeAgo(f.upload_time)}</td>
                        <td className="py-6">
                          {shareUrl ? (
                            <div className="flex items-center gap-3">
                              <span className="text-cyan-400 font-mono">share/{f.share_id}</span>
                              <button 
                                onClick={() => copyLink(shareUrl)}
                                className="px-5 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs rounded-xl transition"
                              >
                                Copy
                              </button>
                            </div>
                          ) : '—'}
                        </td>
                        <td className="py-6 text-right flex gap-4 justify-end">
                          <button 
                            onClick={() => handleOpen(f)}
                            className="bg-blue-600 hover:bg-blue-500 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all active:scale-95"
                            title="Download"
                          >
                            ⬇️
                          </button>
                          <button 
                            onClick={() => handleDelete(f.id, f.filename)}
                            className="bg-red-600 hover:bg-red-500 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all active:scale-95"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && selectedFile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#1e2937] rounded-3xl p-10 w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-4">🔒 Password Required</h3>
            <p className="text-slate-400 mb-6">"{selectedFile.filename}"</p>
            
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-slate-800 p-5 rounded-2xl mb-6 text-lg focus:border-cyan-400 border border-transparent"
            />

            {error && <p className="text-red-400 mb-6">{error}</p>}

            <div className="flex gap-4">
              <button 
                onClick={() => { setShowPasswordModal(false); setError(''); }}
                className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 rounded-2xl font-medium transition"
              >
                Cancel
              </button>
              <button 
                onClick={handlePasswordDownload}
                className="flex-1 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-2xl font-medium transition"
              >
                Download File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}