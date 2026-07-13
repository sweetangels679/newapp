import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogin() {
  const { loginWithEmail, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  if (user && isAdmin) {
    navigate('/admin');
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-24">
      <div className="text-center mb-8">
        <span className="w-14 h-14 rounded-full bg-blush-100 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck size={24} className="text-blush-500" />
        </span>
        <h1 className="font-display font-semibold text-2xl">Admin Login</h1>
        <p className="text-clay text-sm mt-1">Sweet Angels management panel</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-semibold block mb-1.5">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3.5 rounded-2xl border border-blush-100 focus:border-blush-400 outline-none"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold block mb-1.5">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3.5 rounded-2xl border border-blush-100 focus:border-blush-400 outline-none"
          />
        </label>
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blush-400 hover:bg-blush-500 disabled:opacity-60 text-white font-bold py-4 rounded-full"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
