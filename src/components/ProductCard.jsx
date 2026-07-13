import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [liked, setLiked] = useState(false);
  const inStock = product.stock === undefined || product.stock > 0;

  return (
    <div className="group relative bg-white rounded-3xl shadow-card overflow-hidden flex flex-col">
      <Link to={`/product/${product.id}`} className="block relative aspect-square bg-blush-50 overflow-hidden">
        <img
          src={product.images?.[0] || 'https://placehold.co/400x400/FCDFDD/3A2F35?text=Sweet+Angels'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!inStock && (
          <span className="absolute top-3 left-3 bg-ink/80 text-white text-xs font-bold px-3 py-1 rounded-full">
            Out of stock
          </span>
        )}
      </Link>

      <button
        aria-label="Add to wishlist"
        onClick={() => setLiked((v) => !v)}
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-card"
      >
        <Heart size={18} className={liked ? 'fill-blush-500 text-blush-500' : 'text-clay'} />
      </button>

      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${product.id}`} className="font-semibold text-sm text-ink line-clamp-2 mb-1">
          {product.name}
        </Link>
        <p className="text-xs text-clay mb-3">{product.ageGroup || product.category}</p>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="font-bold text-blush-500">₹{product.price}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-xs text-clay/60 line-through ml-1.5">₹{product.mrp}</span>
            )}
          </div>
          <button
            aria-label={`Add ${product.name} to cart`}
            disabled={!inStock}
            onClick={() => addItem(product, product.sizes?.[0])}
            className="w-9 h-9 rounded-full bg-blush-400 disabled:bg-clay/30 hover:bg-blush-500 text-white flex items-center justify-center transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
