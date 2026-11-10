import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import GiftCard from "../components/GiftCard";
import { GiftIcon, HeartIcon } from "../components/Icons";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { formatPrice } from "../utils/format";

export default function GiftDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { add } = useCart();
  const { ids, toggle } = useFavorites();
  const navigate = useNavigate();

  const [gift, setGift] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setGift(null);
    setError("");
    setQty(1);
    setSimilar([]);

    api
      .get(`/gifts/${id}/`)
      .then(async (r) => {
        if (cancelled) return;
        setGift(r.data);
        try {
          const cats = await api.get("/categories/");
          const slug = cats.data.find((c) => c.id === r.data.category)?.slug;
          if (slug) {
            const s = await api.get(`/gifts/?category=${slug}`);
            if (!cancelled) {
              setSimilar(s.data.results.filter((g) => g.id !== r.data.id).slice(0, 4));
            }
          }
        } catch {
          // o'xshash sovg'alar bo'lmasa ham sahifa ishlayveradi
        }
      })
      .catch(() => { if (!cancelled) setError("Sovg'a topilmadi."); });

    return () => { cancelled = true; };
  }, [id]);

  if (error) {
    return (
      <div className="container page">
        <div className="empty">{error} <Link to="/gifts">Katalogga qaytish</Link></div>
      </div>
    );
  }
  if (!gift) return <div className="container page muted">Yuklanmoqda...</div>;

  const isFav = ids.has(gift.id);

  const onHeart = async () => {
    if (!user) return navigate("/login");
    await toggle(gift.id);
  };

  const onAdd = () => {
    add(gift, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="container page">
      <div className="crumbs">
        <Link to="/">Bosh sahifa</Link> / <Link to="/gifts">Sovg'alar</Link> / {gift.category_name}
      </div>

      <div className="detail">
        <div className="detail-img">
          {gift.image ? (
            <img src={gift.image} alt={gift.name} />
          ) : (
            <GiftIcon stroke="#b9b9b0" width="96" height="96" />
          )}
        </div>

        <div className="detail-info">
          <span className="badge badge-static">{gift.category_name}</span>
          <h1 className="detail-title">{gift.name}</h1>
          <div className="detail-price">{formatPrice(gift.price)}</div>
          {gift.description && <p className="detail-desc">{gift.description}</p>}

          <div className="facts">
            <div className="fact">
              <div className="muted small">Kimga</div>
              <b>{gift.recipient_display}</b>
            </div>
            <div className="fact">
              <div className="muted small">Mos yosh</div>
              <b>{gift.min_age}–{gift.max_age}</b>
            </div>
          </div>

          <div className="buy-row">
            <div className="qty">
              <button aria-label="Kamaytirish" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span aria-live="polite">{qty}</span>
              <button aria-label="Ko'paytirish" onClick={() => setQty(Math.min(99, qty + 1))}>+</button>
            </div>
            <button className="btn btn-accent btn-lg grow" onClick={onAdd}>
              {added ? "Savatga qo'shildi ✓" : `Savatga qo'shish · ${formatPrice(Number(gift.price) * qty)}`}
            </button>
            <button
              className={"btn btn-light square" + (isFav ? " fav-on" : "")}
              aria-label={isFav ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
              aria-pressed={isFav}
              onClick={onHeart}
            >
              <HeartIcon filled={isFav} />
            </button>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="section-top">
          <h2 className="section-title">O'xshash sovg'alar</h2>
          <div className="grid">
            {similar.map((g) => <GiftCard key={g.id} gift={g} />)}
          </div>
        </section>
      )}
    </div>
  );
}