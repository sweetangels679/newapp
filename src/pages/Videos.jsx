import { useVideos } from '../lib/useProducts.js';

function getYouTubeId(url) {
  const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

export default function Videos() {
  const { videos, loading } = useVideos();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-semibold text-3xl text-ink mb-2">Video Gallery</h1>
      <p className="text-clay mb-8">See our fabrics, fits, and little models in action.</p>

      {loading && <p className="text-clay">Loading videos…</p>}
      {!loading && videos.length === 0 && (
        <div className="text-center py-20 text-clay">
          <p className="text-4xl mb-3">🎬</p>
          <p className="font-semibold">No videos yet</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((v) => {
          const ytId = getYouTubeId(v.url);
          return (
            <div key={v.id} className="bg-white rounded-3xl overflow-hidden shadow-card">
              <div className="aspect-video bg-blush-50">
                {ytId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${ytId}`}
                    title={v.title || 'Sweet Angels video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-clay text-sm">Invalid video URL</div>
                )}
              </div>
              {v.title && <p className="p-4 font-semibold text-sm">{v.title}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
