import { CheckCircle2 } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Sleep',
    items: ['4-6 mul mul swaddles', '2-3 fitted crib sheets', 'Sleep sack (0-6 months)', 'Baby-safe mattress'],
  },
  {
    title: 'Clothing',
    items: ['6-8 rompers / onesies', '2 seasonal outerwear layers', '4 pairs of soft mittens & booties', '2 caps'],
  },
  {
    title: 'Bath & Skin',
    items: ['Hooded cotton towels', 'Mild baby wash', 'Soft washcloths', 'Baby-safe moisturizer'],
  },
  {
    title: 'Feeding',
    items: ['Burp cloths (5-6)', 'Bibs', 'Nursing cover', 'Bottles, if formula/pumped feeding'],
  },
];

export default function Checklist() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-semibold text-3xl text-ink mb-2">Newborn Checklist</h1>
      <p className="text-clay mb-10">Everything you'll want ready before baby arrives — curated by the Sweet Angels team.</p>

      <div className="grid sm:grid-cols-2 gap-6">
        {SECTIONS.map((s) => (
          <div key={s.title} className="bg-white rounded-3xl p-6 shadow-card">
            <h2 className="font-display font-semibold text-lg text-ink mb-4">{s.title}</h2>
            <ul className="space-y-2.5">
              {s.items.map((it) => (
                <li key={it} className="flex items-start gap-2 text-sm text-clay">
                  <CheckCircle2 size={18} className="text-sage-500 shrink-0 mt-0.5" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
