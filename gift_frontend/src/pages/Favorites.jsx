import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import GiftCard from "../components/GiftCard";

export default function Favorites() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api
      .get("/favorites/")
      .then((r) => setItems(r.data.map((f) => f.gift_detail)))
      .catch(() => setItems([]));
  }, []);

  const onChange = (id, isFav) => {
    if (!isFav) setItems((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="container page">
      <h1 className="page-title">Sevimlilar</h1>
      {items === null && <p className="muted">Yuklanmoqda...</p>}
      {items && items.length === 0 && (
        <div className="empty">
          Hali sevimli sovg'a yo'q. <Link to="/gifts" className="btn btn-dark btn-sm">Sovg'alarni ko'rish</Link>
        </div>
      )}
      {items && items.length > 0 && (
        <div className="grid">
          {items.map((g) => <GiftCard key={g.id} gift={g} onFavoriteChange={onChange} />)}
        </div>
      )}
    </div>
  );
}