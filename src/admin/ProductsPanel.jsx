import { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { Plus, Pencil, Trash2, Share2, Mail } from 'lucide-react';
import { db } from '../lib/firebase.js';
import { useProducts } from '../lib/useProducts.js';
import ProductForm from './ProductForm.jsx';

export default function ProductsPanel() {
  const { products, loading } = useProducts();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await deleteDoc(doc(db, 'products', id));
  };

  const shareWhatsApp = (p) => {
    const url = `${window.location.origin}/product/${p.id}`;
    const text = encodeURIComponent(`Check out ${p.name} on Sweet Angels — ₹${p.price}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareEmail = (p) => {
    const url = `${window.location.origin}/product/${p.id}`;
    const subject = encodeURIComponent(`Sweet Angels — ${p.name}`);
    const body = encodeURIComponent(`Check out ${p.name} — ₹${p.price}\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blush-400 hover:bg-blush-500 text-white font-bold px-6 py-3 rounded-full"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {loading && <p className="text-clay">Loading…</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-card">
            <img
              src={p.images?.[0] || 'https://placehold.co/300x300/FCDFDD/3A2F35?text=Sweet+Angels'}
              alt={p.name}
              className="w-full aspect-square object-cover"
            />
            <div className="p-4">
              <p className="font-semibold text-sm truncate">{p.name}</p>
              <p className="text-blush-500 font-bold mb-3">₹{p.price}</p>
              <p className="text-xs text-clay mb-3">Stock: {p.stock ?? '—'}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} aria-label="Edit" className="flex-1 flex items-center justify-center gap-1 bg-sage-50 text-sage-500 text-xs font-bold py-2.5 rounded-full">
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} aria-label="Delete" className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-500 text-xs font-bold py-2.5 rounded-full">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => shareWhatsApp(p)} aria-label="Share on WhatsApp" className="flex-1 flex items-center justify-center gap-1 bg-blush-50 text-blush-500 text-xs font-bold py-2.5 rounded-full">
                  <Share2 size={13} /> WhatsApp
                </button>
                <button onClick={() => shareEmail(p)} aria-label="Share via email" className="flex-1 flex items-center justify-center gap-1 bg-sky-50 text-sky-300 text-xs font-bold py-2.5 rounded-full">
                  <Mail size={13} /> Email
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {formOpen && <ProductForm existing={editing} onClose={closeForm} />}
    </div>
  );
}
