import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../lib/firebase.js';

export default function UserPanel() {
  const { user, loginWithGoogle, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    (async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userEmail', '==', user.email),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="font-display font-semibold text-2xl mb-3">Welcome to Sweet Angels</h1>
        <p className="text-clay mb-8">Sign in to track your orders and save your details for faster checkout.</p>
        <button
          onClick={loginWithGoogle}
          className="bg-white shadow-card hover:shadow-soft border border-blush-100 font-bold px-8 py-4 rounded-full inline-flex items-center gap-2"
        >
          Continue with Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {user.photoURL && <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full" />}
          <div>
            <p className="font-display font-semibold text-lg">{user.displayName}</p>
            <p className="text-sm text-clay">{user.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-1.5 text-sm font-semibold text-clay hover:text-blush-500">
          <LogOut size={16} /> Sign out
        </button>
      </div>

      <h2 className="font-display font-semibold text-xl mb-4">Your Orders</h2>
      {loading && <p className="text-clay">Loading orders…</p>}
      {!loading && orders.length === 0 && (
        <div className="text-center py-16 text-clay bg-white rounded-3xl shadow-card">
          <Package size={36} className="mx-auto mb-3 text-blush-300" />
          <p>No orders yet.</p>
        </div>
      )}
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-white rounded-3xl p-5 shadow-card">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-clay">Order #{o.id.slice(0, 8)}</span>
              <span className="text-xs font-bold text-sage-500 uppercase">{o.status || 'new'}</span>
            </div>
            <div className="text-sm text-clay mb-2">
              {o.items?.map((it) => `${it.name} x${it.qty}`).join(', ')}
            </div>
            <p className="font-bold text-blush-500">₹{o.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
