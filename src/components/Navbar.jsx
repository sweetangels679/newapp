import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/videos', label: 'Videos' },
  { to: '/checklist', label: 'Checklist' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count, setIsOpen } = useCart();
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
      isActive ? 'bg-blush-100 text-blush-500' : 'text-ink/70 hover:text-ink hover:bg-blush-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-blush-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-full bg-blush-200 flex items-center justify-center text-lg">🍼</span>
          <span className="font-display font-semibold text-xl text-ink">Sweet Angels</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/account"
            aria-label="User account"
            className="hidden sm:flex w-11 h-11 items-center justify-center rounded-full hover:bg-blush-50"
          >
            <User size={22} className="text-ink/70" />
            {user && <span className="sr-only">Signed in as {user.displayName}</span>}
          </Link>

          <button
            aria-label={`Open cart, ${count} items`}
            onClick={() => setIsOpen(true)}
            className="relative w-11 h-11 flex items-center justify-center rounded-full hover:bg-blush-50"
          >
            <ShoppingBag size={22} className="text-ink/70" />
            {count > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blush-400 text-white text-[11px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          <button
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-full hover:bg-blush-50"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-blush-100 px-4 py-3 flex flex-col gap-1 bg-cream">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/account" className={linkClass} onClick={() => setOpen(false)}>
            User Panel
          </NavLink>
        </div>
      )}
    </header>
  );
}
