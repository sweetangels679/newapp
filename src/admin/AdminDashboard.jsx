import { useState } from 'react';
import { LogOut, Package, ShoppingBag, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import OrdersPanel from './OrdersPanel.jsx';
import ProductsPanel from './ProductsPanel.jsx';
import VideosPanel from './VideosPanel.jsx';

const TABS = [
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'products', label: 'Products', icon: ShoppingBag },
  { key: 'videos', label: 'Videos', icon: Film },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('orders');
  const { logout, user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-semibold text-3xl">Admin Dashboard</h1>
          <p className="text-sm text-clay">{user?.email}</p>
        </div>
        <button onClick={logout} className="flex items-center gap-1.5 text-sm font-semibold text-clay hover:text-blush-500">
          <LogOut size={16} /> Sign out
        </button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              tab === key ? 'bg-blush-400 text-white' : 'bg-white text-clay shadow-card'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === 'orders' && <OrdersPanel />}
      {tab === 'products' && <ProductsPanel />}
      {tab === 'videos' && <VideosPanel />}
    </div>
  );
}
