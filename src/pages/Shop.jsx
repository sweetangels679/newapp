import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '../lib/useProducts.js';
import ProductCard from '../components/ProductCard.jsx';

const CATEGORIES = ['Newborn', 'Toddler', 'Accessories', 'Swaddles'];
const AGE_GROUPS = ['0-3 months', '3-6 months', '6-12 months', '1-2 years', '2-4 years'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function Shop() {
  const { products, loading } = useProducts();
  const [params] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [category, setCategory] = useState(params.get('category') || '');
  const [ageGroup, setAgeGroup] = useState('');
  const [size, setSize] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (ageGroup && p.ageGroup !== ageGroup) return false;
      if (size && !(p.sizes || []).includes(size)) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
  }, [products, category, ageGroup, size, maxPrice]);

  const clearFilters = () => {
    setCategory('');
    setAgeGroup('');
    setSize('');
    setMaxPrice(5000);
  };

  const FilterGroup = ({ label, options, value, onChange }) => (
    <div className="mb-6">
      <p className="font-semibold text-sm text-ink mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(value === opt ? '' : opt)}
            className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
              value === opt
                ? 'bg-blush-400 border-blush-400 text-white'
                : 'bg-white border-blush-100 text-clay hover:border-blush-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-semibold text-3xl text-ink">Shop All</h1>
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="sm:hidden flex items-center gap-2 bg-white shadow-card px-4 py-2.5 rounded-full text-sm font-semibold"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="grid sm:grid-cols-[240px_1fr] gap-8">
        <aside className={`${filtersOpen ? 'block' : 'hidden'} sm:block`}>
          <div className="bg-white rounded-3xl p-5 shadow-card sm:sticky sm:top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Filters</h2>
              <button onClick={clearFilters} className="text-xs text-blush-500 font-semibold">
                Clear all
              </button>
            </div>
            <FilterGroup label="Category" options={CATEGORIES} value={category} onChange={setCategory} />
            <FilterGroup label="Age Group" options={AGE_GROUPS} value={ageGroup} onChange={setAgeGroup} />
            <FilterGroup label="Size" options={SIZES} value={size} onChange={setSize} />
            <div>
              <p className="font-semibold text-sm text-ink mb-2">Max Price: ₹{maxPrice}</p>
              <input
                type="range"
                min="200"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blush-400"
              />
            </div>
          </div>
        </aside>

        <div>
          {loading && <p className="text-clay">Loading products…</p>}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-clay">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold">No products match your filters</p>
              <button onClick={clearFilters} className="mt-3 text-blush-500 font-semibold underline">
                Clear filters
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
