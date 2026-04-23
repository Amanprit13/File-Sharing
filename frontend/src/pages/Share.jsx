import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Share() {
  const { shareId } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/share/${shareId}`)
      .then(res => {
        setFileInfo(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('This share link is invalid or has expired.');
        setLoading(false);
      });
  }, [shareId]);

  const handleDownload = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/download/${shareId}`, { password }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = fileInfo?.filename || 'file';
      link.click();
    } catch (err) {
      setError(err.response?.data?.error || 'Download failed');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400 text-3xl">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0a0a2a] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1e2937] rounded-3xl p-12 text-center">
        <div className="text-8xl mb-8">📄</div>
        <h2 className="text-4xl font-bold mb-4">Download File</h2>
        <p className="text-2xl text-cyan-300 mb-10 break-words">{fileInfo.filename}</p>

        {fileInfo.password && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full bg-slate-800 p-5 rounded-2xl mb-8 text-lg"
          />
        )}

        <button 
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 py-6 text-2xl font-semibold rounded-3xl hover:brightness-110 transition"
        >
          Download Now
        </button>

        <p className="text-xs text-slate-500 mt-10">This link may expire. Download responsibly.</p>
      </div>
    </div>
  );
}