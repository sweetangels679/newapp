import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQty, removeItem, subtotal } = useCart();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/40 z-50"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-soft flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-blush-100">
          <h2 className="font-display font-semibold text-lg">Your Cart ({items.length})</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close cart" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blush-50">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 && (
            <div className="text-center text-clay py-16">
              <p className="text-4xl mb-3">🧸</p>
              <p className="font-semibold">Your cart is empty</p>
              <p className="text-sm mt-1">Add something soft and sweet for your little one.</p>
            </div>
          )}
          {items.map((item) => (
            <div key={item.key} className="flex gap-3">
              <img
                src={item.image || 'https://placehold.co/100x100/FCDFDD/3A2F35?text=Sweet+Angels'}
                alt={item.name}
                className="w-20 h-20 rounded-2xl object-cover bg-blush-50"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{item.name}</p>
                {item.size && <p className="text-xs text-clay">Size: {item.size}</p>}
                <p className="text-sm font-bold text-blush-500 mt-1">₹{item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQty(item.key, item.qty - 1)}
                    className="w-7 h-7 rounded-full border border-blush-200 flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm w-5 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.key, item.qty + 1)}
                    className="w-7 h-7 rounded-full border border-blush-200 flex items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="ml-auto text-clay hover:text-blush-500"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-blush-100 px-5 py-5 space-y-3">
            <div className="flex justify-between text-sm text-clay">
              <span>Subtotal</span>
              <span className="font-bold text-ink">₹{subtotal}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-blush-400 hover:bg-blush-500 text-white font-bold py-4 rounded-full transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
