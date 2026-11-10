import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { BagIcon, GiftIcon, HeartIcon } from "./Icons";

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container header-in">
        <Link to="/" className="logo">
          <GiftIcon /> Gift Finder
        </Link>

        <nav className="nav" aria-label="Asosiy menyu">
          <NavLink to="/" end>Bosh sahifa</NavLink>
          <NavLink to="/gifts">Sovg'alar</NavLink>
          {user && <NavLink to="/orders">Buyurtmalarim</NavLink>}
          {user?.is_staff && <NavLink to="/admin">Admin panel</NavLink>}
        </nav>

        <div className="header-actions">
          <Link to="/favorites" className="icon-btn" aria-label="Sevimlilar">
            <HeartIcon />
          </Link>
          <Link to="/cart" className="icon-btn" aria-label="Savat">
            <BagIcon />
            {count > 0 && <span className="count">{count}</span>}
          </Link>
          {user ? (
            <button className="btn btn-light btn-sm" onClick={onLogout}>
              Chiqish ({user.username})
            </button>
          ) : (
            <Link to="/login" className="btn btn-light btn-sm">Kirish</Link>
          )}
        </div>
      </div>
    </header>
  );
}