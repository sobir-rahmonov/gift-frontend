import { Link, NavLink, Outlet } from "react-router-dom";
import { GiftIcon } from "../../components/Icons";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin">
      <aside className="admin-side">
        <div>
          <div className="admin-brand"><GiftIcon /> Admin</div>
          <nav className="admin-nav" aria-label="Admin menyu">
            <NavLink to="/admin/gifts">Sovg'alar</NavLink>
            <NavLink to="/admin/categories">Kategoriyalar</NavLink>
            <NavLink to="/admin/orders">Buyurtmalar</NavLink>
          </nav>
        </div>
        <div className="admin-foot">
          <Link to="/">← Saytga o'tish</Link>
          <button className="btn-link" onClick={logout}>Chiqish ({user.username})</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}