import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { useProducts } from '../lib/useProducts.js';
import ProductCard from '../components/ProductCard.jsx';

const CATEGORIES = [
  { name: 'Newborn', emoji: '👶', color: 'bg-blush-100' },
  { name: 'Toddler', emoji: '🧒', color: 'bg-sage-100' },
  { name: 'Accessories', emoji: '🎀', color: 'bg-sky-100' },
  { name: 'Swaddles', emoji: '🌙', color: 'bg-apricot-100' },
];

export default function Home() {
  const { products, loading } = useProducts();
  const trending = products.slice(0, 10);
  const scrollerRef = useRef(null);

  const scroll = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative scallop-edge bg-blush-100 overflow-hidden" style={{ '--scallop-color': '#FFF9F2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-white/70 text-blush-500 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <Sparkles size={14} /> Pure Mul Mul Cotton
            </span>
            <h1 className="font-display font-semibold text-4xl sm:text-5xl leading-tight text-ink mb-4">
              Softness your little one will love
            </h1>
            <p className="text-clay text-base sm:text-lg mb-8 max-w-md">
              Premium swaddles, rompers, and nursery essentials — gentle on skin,
              made for every giggle and every nap.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="bg-blush-400 hover:bg-blush-500 text-white font-bold px-8 py-4 rounded-full transition-colors"
              >
                Shop Now
              </Link>
              <Link
                to="/shop?category=Newborn"
                className="bg-white hover:bg-sage-50 text-ink font-bold px-8 py-4 rounded-full transition-colors"
              >
                Newborn Edit
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80"
              alt="Baby wrapped in a soft cotton swaddle"
              className="rounded-cloud shadow-soft w-full aspect-[4/3] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-2 pt-10 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Truck, text: 'Free shipping across India' },
          { icon: ShieldCheck, text: '100% premium cotton, skin safe' },
          { icon: Sparkles, text: 'Loved by 5,000+ parents' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-card">
            <span className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center shrink-0">
              <Icon size={18} className="text-sage-500" />
            </span>
            <span className="text-sm font-semibold text-ink">{text}</span>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display font-semibold text-2xl sm:text-3xl text-ink mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to={`/shop?category=${encodeURIComponent(c.name)}`}
              className={`${c.color} rounded-3xl p-6 flex flex-col items-center justify-center gap-2 hover:scale-[1.02] transition-transform text-center`}
            >
              <span className="text-4xl">{c.emoji}</span>
              <span className="font-display font-semibold text-ink">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Now carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-ink">Trending Now</h2>
          <div className="hidden sm:flex gap-2">
            <button onClick={() => scroll(-1)} aria-label="Scroll left" className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll(1)} aria-label="Scroll right" className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {loading && <p className="text-clay">Loading products…</p>}
        {!loading && trending.length === 0 && (
          <p className="text-clay">No products yet — add some from the admin panel.</p>
        )}

        <div ref={scrollerRef} className="carousel-scroll flex gap-4 overflow-x-auto pb-4 snap-x">
          {trending.map((p) => (
            <div key={p.id} className="min-w-[220px] sm:min-w-[260px] snap-start">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
