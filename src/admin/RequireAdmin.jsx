import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <p className="text-center py-24 text-clay">Loading…</p>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  return children;
}
