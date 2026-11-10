import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { formatPrice } from "../utils/format";
import { GiftIcon, HeartIcon } from "./Icons";

export default function GiftCard({ gift, onFavoriteChange }) {
  const { user } = useAuth();
  const { ids, toggle } = useFavorites();
  const { add } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const isFav = ids.has(gift.id);

  const onHeart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const now = await toggle(gift.id);
    onFavoriteChange?.(gift.id, now);
  };

  const onAdd = () => {
    add(gift);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="gift-card">
      <div className="gift-img">
        {gift.image ? (
          <img src={gift.image} alt={gift.name} />
        ) : (
          <div className="gift-ph"><GiftIcon stroke="#b9b9b0" width="44" height="44" /></div>
        )}
        <span className="badge">{gift.category_name}</span>
        <button
          type="button"
          className={"heart" + (isFav ? " on" : "")}
          aria-label={isFav ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
          aria-pressed={isFav}
          onClick={onHeart}
        >
          <HeartIcon filled={isFav} />
        </button>
      </div>
      <div className="gift-body">
        <Link to={`/gifts/${gift.id}`} className="gift-name">{gift.name}</Link>
        <div className="muted small">{gift.recipient_display} uchun</div>
        <div className="gift-foot">
          <b className="price">{formatPrice(gift.price)}</b>
          <button type="button" className="btn btn-dark btn-sm" onClick={onAdd}>
            {added ? "Qo'shildi ✓" : "Savatga"}
          </button>
        </div>
      </div>
    </article>
  );
}