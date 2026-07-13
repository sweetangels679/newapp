import { useState } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { X, Upload, Link as LinkIcon, Trash2 } from 'lucide-react';
import { db } from '../lib/firebase.js';
import { uploadImageToCloudinary } from '../lib/uploadImage.js';

const CATEGORIES = ['Newborn', 'Toddler', 'Accessories', 'Swaddles'];
const AGE_GROUPS = ['0-3 months', '3-6 months', '6-12 months', '1-2 years', '2-4 years'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL'];

export default function ProductForm({ existing, onClose }) {
  const [form, setForm] = useState({
    name: existing?.name || '',
    price: existing?.price || '',
    mrp: existing?.mrp || '',
    category: existing?.category || CATEGORIES[0],
    ageGroup: existing?.ageGroup || AGE_GROUPS[0],
    sizes: existing?.sizes || [],
    stock: existing?.stock ?? 10,
    description: existing?.description || '',
    images: existing?.images || [],
  });
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggleSize = (s) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setForm((f) => ({ ...f, images: [...f.images, url] }));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    if (!urlInput.trim()) return;
    setForm((f) => ({ ...f, images: [...f.images, urlInput.trim()] }));
    setUrlInput('');
  };

  const removeImage = (idx) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        mrp: form.mrp ? Number(form.mrp) : null,
        stock: Number(form.stock),
      };
      if (existing) {
        await updateDoc(doc(db, 'products', existing.id), payload);
      } else {
        await addDoc(collection(db, 'products'), { ...payload, createdAt: serverTimestamp() });
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-xl">{existing ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full hover:bg-blush-50 flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Product Name" value={form.name} onChange={set('name')} required />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (₹)" type="number" value={form.price} onChange={set('price')} required />
            <Field label="MRP (₹, optional)" type="number" value={form.mrp} onChange={set('mrp')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={set('category')} options={CATEGORIES} />
            <Select label="Age Group" value={form.ageGroup} onChange={set('ageGroup')} options={AGE_GROUPS} />
          </div>

          <div>
            <p className="text-sm font-semibold mb-1.5">Available Sizes</p>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`w-11 h-11 rounded-full border font-semibold text-sm ${
                    form.sizes.includes(s) ? 'bg-blush-400 border-blush-400 text-white' : 'bg-white border-blush-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Field label="Stock Quantity" type="number" value={form.stock} onChange={set('stock')} />

          <label className="block">
            <span className="text-sm font-semibold block mb-1.5">Description</span>
            <textarea
              rows="3"
              value={form.description}
              onChange={set('description')}
              className="w-full px-4 py-3 rounded-2xl border border-blush-100 focus:border-blush-400 outline-none"
            />
          </label>

          <div>
            <p className="text-sm font-semibold mb-1.5">Images</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white shadow-card flex items-center justify-center"
                  >
                    <Trash2 size={12} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <label className="flex items-center gap-2 text-sm font-semibold bg-sage-50 text-sage-500 px-4 py-2.5 rounded-full cursor-pointer">
                <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload from device'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Paste image URL"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="px-3 py-2.5 rounded-full border border-blush-100 text-sm w-48"
                />
                <button type="button" onClick={addImageUrl} className="w-9 h-9 rounded-full bg-blush-100 flex items-center justify-center">
                  <LinkIcon size={14} className="text-blush-500" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blush-400 hover:bg-blush-500 disabled:opacity-60 text-white font-bold py-4 rounded-full"
          >
            {saving ? 'Saving…' : existing ? 'Save Changes' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold block mb-1.5">{label}</span>
      <input {...props} className="w-full px-4 py-3 rounded-2xl border border-blush-100 focus:border-blush-400 outline-none" />
    </label>
  );
}

function Select({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold block mb-1.5">{label}</span>
      <select {...props} className="w-full px-4 py-3 rounded-2xl border border-blush-100 focus:border-blush-400 outline-none bg-white">
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
