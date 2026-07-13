import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Phone, MapPin } from 'lucide-react';
import { db } from '../lib/firebase.js';

const STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const setStatus = async (id, status) => {
    await updateDoc(doc(db, 'orders', id), { status });
  };

  if (loading) return <p className="text-clay">Loading orders…</p>;
  if (orders.length === 0) return <p className="text-clay">No orders yet.</p>;

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="bg-white rounded-3xl p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <p className="font-bold text-ink">{o.shipping?.fullName}</p>
              <p className="text-xs text-clay">Order #{o.id.slice(0, 8)} · {o.createdAt?.toDate?.().toLocaleString?.() || ''}</p>
            </div>
            <select
              value={o.status || 'new'}
              onChange={(e) => setStatus(o.id, e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-full bg-sage-50 text-sage-500 border border-sage-100"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-3 text-sm text-clay">
            <div className="flex items-center gap-2">
              <Phone size={14} /> {o.shipping?.phone}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} /> {o.shipping?.address}, {o.shipping?.city}, {o.shipping?.state} - {o.shipping?.pincode}
            </div>
          </div>

          <div className="border-t border-blush-100 pt-3 space-y-1">
            {o.items?.map((it, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-clay">{it.name} {it.size ? `(${it.size})` : ''} x{it.qty}</span>
                <span className="font-semibold">₹{it.price * it.qty}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold mt-2 pt-2 border-t border-blush-100">
            <span>Total</span>
            <span className="text-blush-500">₹{o.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
