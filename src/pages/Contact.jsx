import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-2 gap-10">
      <div>
        <h1 className="font-display font-semibold text-3xl text-ink mb-4">Get in Touch</h1>
        <p className="text-clay mb-8">
          Questions about sizing, an order, or a custom request? We'd love to hear from you.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-full bg-blush-100 flex items-center justify-center"><Phone size={18} className="text-blush-500" /></span>
            <span className="text-sm font-semibold">+91 96624 89679</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-full bg-sage-100 flex items-center justify-center"><Mail size={18} className="text-sage-500" /></span>
            <span className="text-sm font-semibold">sweetangels679@gmail.com</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-full bg-sky-100 flex items-center justify-center"><MapPin size={18} className="text-sky-300" /></span>
            <span className="text-sm font-semibold">Rajkot, Gujarat, India</span>
          </div>
        </div>
      </div>

      <form className="bg-white rounded-3xl p-6 shadow-card space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block">
          <span className="text-sm font-semibold block mb-1.5">Name</span>
          <input className="w-full px-4 py-3 rounded-2xl border border-blush-100 focus:border-blush-400 outline-none" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold block mb-1.5">Message</span>
          <textarea rows="4" className="w-full px-4 py-3 rounded-2xl border border-blush-100 focus:border-blush-400 outline-none" />
        </label>
        <button className="w-full bg-blush-400 hover:bg-blush-500 text-white font-bold py-4 rounded-full">
          Send Message
        </button>
      </form>
    </div>
  );
}
