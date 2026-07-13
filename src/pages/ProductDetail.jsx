import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useProduct } from '../lib/useProducts.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [liked, setLiked] = useState(false);

  if (loading) return <p className="text-center py-20 text-clay">Loading…</p>;
  if (!product) return <p className="text-center py-20 text-clay">Product not found.</p>;

  const images = product.images?.length ? product.images : ['https://placehold.co/600x600/FCDFDD/3A2F35?text=Sweet+Angels'];
  const inStock = product.stock === undefined || product.stock > 0;

  const handleAdd = () => addItem(product, selectedSize);
  const handleBuyNow = () => {
    addItem(product, selectedSize);
    navigate('/checkout');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-2 gap-10">
      {/* Image viewer */}
      <div>
        <div className="aspect-square rounded-cloud overflow-hidden bg-blush-50 mb-3">
          <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 ${
                  activeImg === i ? 'border-blush-400' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink">{product.name}</h1>
          <button
            onClick={() => setLiked((v) => !v)}
            aria-label="Add to wishlist"
            className="w-11 h-11 rounded-full bg-blush-50 flex items-center justify-center shrink-0"
          >
            <Heart size={20} className={liked ? 'fill-blush-500 text-blush-500' : 'text-clay'} />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <span className="text-2xl font-bold text-blush-500">₹{product.price}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-clay/60 line-through">₹{product.mrp}</span>
          )}
          {!inStock && <span className="text-sm font-semibold text-red-500">Out of stock</span>}
        </div>

        <p className="text-clay leading-relaxed mt-4">
          {product.description || 'Crafted from breathable, ultra-soft mul mul cotton for that gentle, lived-in feel from the very first wear.'}
        </p>

        {product.sizes?.length > 0 && (
          <div className="mt-6">
            <p className="font-semibold text-sm mb-2">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-12 h-12 rounded-full border font-semibold text-sm transition-colors ${
                    selectedSize === s
                      ? 'bg-blush-400 border-blush-400 text-white'
                      : 'bg-white border-blush-200 text-ink hover:border-blush-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          <button
            disabled={!inStock}
            onClick={handleAdd}
            className="flex-1 bg-white border-2 border-blush-400 text-blush-500 font-bold py-4 rounded-full disabled:opacity-40"
          >
            Add to Cart
          </button>
          <button
            disabled={!inStock}
            onClick={handleBuyNow}
            className="flex-1 bg-blush-400 hover:bg-blush-500 text-white font-bold py-4 rounded-full disabled:opacity-40"
          >
            Buy Now
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-blush-100">
          {[
            { icon: ShieldCheck, text: '100% Cotton' },
            { icon: Truck, text: 'Fast Shipping' },
            { icon: RefreshCw, text: 'Easy Returns' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-center text-center gap-1.5">
              <Icon size={20} className="text-sage-500" />
              <span className="text-xs text-clay font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
