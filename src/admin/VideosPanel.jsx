import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2 } from 'lucide-react';
import { db } from '../lib/firebase.js';
import { useVideos } from '../lib/useProducts.js';

export default function VideosPanel() {
  const { videos, loading } = useVideos();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'videos'), { url: url.trim(), title: title.trim(), createdAt: serverTimestamp() });
      setUrl('');
      setTitle('');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this video?')) return;
    await deleteDoc(doc(db, 'videos', id));
  };

  return (
    <div>
      <form onSubmit={handleAdd} className="bg-white rounded-3xl p-5 shadow-card mb-6 flex flex-wrap gap-3 items-end">
        <label className="flex-1 min-w-[200px]">
          <span className="text-sm font-semibold block mb-1.5">YouTube URL</span>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-4 py-3 rounded-2xl border border-blush-100 focus:border-blush-400 outline-none"
          />
        </label>
        <label className="flex-1 min-w-[160px]">
          <span className="text-sm font-semibold block mb-1.5">Title (optional)</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-blush-100 focus:border-blush-400 outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-blush-400 hover:bg-blush-500 text-white font-bold px-6 py-3 rounded-full"
        >
          <Plus size={18} /> Add Video
        </button>
      </form>

      {loading && <p className="text-clay">Loading…</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((v) => (
          <div key={v.id} className="bg-white rounded-3xl p-4 shadow-card">
            <p className="font-semibold text-sm truncate mb-1">{v.title || 'Untitled video'}</p>
            <p className="text-xs text-clay truncate mb-3">{v.url}</p>
            <button
              onClick={() => handleDelete(v.id)}
              className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 px-4 py-2 rounded-full"
            >
              <Trash2 size={13} /> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
