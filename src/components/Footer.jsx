import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-blush-50 border-t border-blush-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-full bg-blush-200 flex items-center justify-center">🍼</span>
            <span className="font-display font-semibold text-lg">Sweet Angels</span>
          </div>
          <p className="text-sm text-clay leading-relaxed">
            Soft mul-mul cotton essentials for your little one — swaddles, rompers,
            and nursery favorites made to feel like a hug.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold text-ink mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-clay">
            <li><Link to="/shop" className="hover:text-blush-500">Shop All</Link></li>
            <li><Link to="/videos" className="hover:text-blush-500">Video Gallery</Link></li>
            <li><Link to="/checklist" className="hover:text-blush-500">Newborn Checklist</Link></li>
            <li><Link to="/contact" className="hover:text-blush-500">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-ink mb-3">Stay connected</h4>
          <div className="flex gap-3 mb-4">
            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-card hover:scale-105 transition-transform">
              <Instagram size={18} className="text-blush-500" />
            </a>
            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-card hover:scale-105 transition-transform">
              <Facebook size={18} className="text-blush-500" />
            </a>
            <a href="#" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-card hover:scale-105 transition-transform">
              <MessageCircle size={18} className="text-blush-500" />
            </a>
          </div>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-clay/70 hover:text-clay"
          >
            <ShieldCheck size={14} /> Admin Login
          </Link>
        </div>
      </div>
      <div className="text-center text-xs text-clay/60 pb-6">
        © {new Date().getFullYear()} Sweet Angels. All rights reserved.
      </div>
    </footer>
  );
}
