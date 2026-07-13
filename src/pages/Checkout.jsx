import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../lib/firebase.js';
import { notifyAdminWhatsApp, formatOrderMessage } from '../lib/notify.js';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.displayName || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setPlacing(true);
    setError('');
    try {
      const orderData = {
        items,
        total: subtotal,
        shipping: form,
        paymentMethod: 'COD',
        userEmail: user?.email || null,
        status: 'new',
        createdAt: serverTimestamp(),
      };
      const ref = await addDoc(collection(db, 'orders'), orderData);
      await notifyAdminWhatsApp({
        message: formatOrderMessage({ ...orderData, id: ref.id }),
      });
      clearCart();
      setPlaced(true);
    } catch (err) {
      console.error(err);
      setError('Something went wrong placing your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (placed) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <CheckCircle size={56} className="text-sage-500 mx-auto mb-4" />
        <h1 className="font-display font-semibold text-2xl mb-2">Order placed!</h1>
        <p className="text-clay mb-8">We've let our team know — they'll be in touch to confirm delivery.</p>
        <button onClick={() => navigate('/shop')} className="bg-blush-400 hover:bg-blush-500 text-white font-bold px-8 py-4 rounded-full">
          Continue Shopping
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center text-clay">
        <p className="text-4xl mb-3">🛍️</p>
        <p className="font-semibold mb-4">Your cart is empty</p>
        <button onClick={() => navigate('/shop')} className="bg-blush-400 hover:bg-blush-500 text-white font-bold px-8 py-4 rounded-full">
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-[1fr_320px] gap-10">
      <div>
        <h1 className="font-display font-semibold text-3xl mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full Name" value={form.fullName} onChange={update('fullName')} required />
          <Field label="Phone Number" value={form.phone} onChange={update('phone')} type="tel" required />
          <Field label="Address" value={form.address} onChange={update('address')} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" value={form.city} onChange={update('city')} required />
            <Field label="State" value={form.state} onChange={update('state')} required />
          </div>
          <Field label="Pincode" value={form.pincode} onChange={update('pincode')} required />

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={placing}
            className="w-full bg-blush-400 hover:bg-blush-500 disabled:opacity-60 text-white font-bold py-4 rounded-full mt-4"
          >
            {placing ? 'Placing order…' : `Place Order — ₹${subtotal}`}
          </button>
        </form>
      </div>

      <aside className="bg-white rounded-3xl p-5 shadow-card h-fit">
        <h2 className="font-display font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.key} className="flex justify-between text-sm">
              <span className="text-clay">{item.name} x{item.qty}</span>
              <span className="font-semibold">₹{item.price * item.qty}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-blush-100 mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{subtotal}</span>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink block mb-1.5">{label}</span>
      <input
        {...props}
        className="w-full px-4 py-3.5 rounded-2xl border border-blush-100 focus:border-blush-400 outline-none bg-white"
      />
    </label>
  );
}
