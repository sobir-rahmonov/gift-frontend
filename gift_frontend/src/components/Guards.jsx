import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container page muted">Yuklanmoqda...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container page muted">Yuklanmoqda...</div>;
  if (!user?.is_staff) return <Navigate to="/" replace />;
  return children;
}