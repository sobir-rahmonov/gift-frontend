import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { GiftIcon, TrashIcon } from "../components/Icons";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { errorText, formatPrice } from "../utils/format";

export default function Cart() {
  const { items, setQty, remove, clear, total } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({ full_name: "", phone: "", address: "", note: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await api.post("/orders/", {
        ...form,
        items: items.map((i) => ({ gift: i.id, quantity: i.qty })),
      });
      clear();
      setDone(res.data);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="container page">
        <div className="success">
          <h1>Buyurtmangiz qabul qilindi!</h1>
          <p>Buyurtma raqami: <b>#{done.id}</b>. Jami: <b>{formatPrice(done.total_price)}</b>.</p>
          <p className="muted">Tez orada siz bilan telefon orqali bog'lanamiz.</p>
          <div className="hero-actions">
            <Link to="/gifts" className="btn btn-accent">Xaridni davom ettirish</Link>
            {user && <Link to="/orders" className="btn btn-light">Buyurtmalarim</Link>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="page-title">Savat</h1>

      {items.length === 0 ? (
        <div className="empty">
          Savat hozircha bo'sh. <Link to="/gifts" className="btn btn-dark btn-sm">Sovg'alarni ko'rish</Link>
        </div>
      ) : (
        <div className="cart">
          <section className="cart-items">
            {items.map((it) => (
              <article key={it.id} className="cart-row">
                <div className="cart-thumb">
                  {it.image ? <img src={it.image} alt="" /> : <div className="gift-ph"><GiftIcon stroke="#b9b9b0" /></div>}
                </div>
                <div className="cart-info">
                  <Link to={`/gifts/${it.id}`} className="gift-name">{it.name}</Link>
                  <div className="muted small">{it.category_name}</div>
                  <div className="muted small">{formatPrice(it.price)} / dona</div>
                </div>
                <div className="qty">
                  <button aria-label="Kamaytirish" onClick={() => setQty(it.id, it.qty - 1)}>−</button>
                  <span>{it.qty}</span>
                  <button aria-label="Ko'paytirish" onClick={() => setQty(it.id, it.qty + 1)}>+</button>
                </div>
                <div className="cart-sum">{formatPrice(it.price * it.qty)}</div>
                <button className="icon-btn" aria-label="Savatdan olib tashlash" onClick={() => remove(it.id)}>
                  <TrashIcon />
                </button>
              </article>
            ))}
          </section>

          <form className="order-form" onSubmit={submit}>
            <h2>Buyurtma ma'lumotlari</h2>

            <div className="field">
              <label className="label" htmlFor="o-name">Ism-familiya</label>
              <input id="o-name" className="input" value={form.full_name} onChange={set("full_name")} autoComplete="name" required />
            </div>
            <div className="field">
              <label className="label" htmlFor="o-phone">Telefon</label>
              <input id="o-phone" className="input" type="tel" placeholder="+998" value={form.phone} onChange={set("phone")} autoComplete="tel" required />
            </div>
            <div className="field">
              <label className="label" htmlFor="o-addr">Manzil</label>
              <textarea id="o-addr" className="input" rows="3" value={form.address} onChange={set("address")} required />
            </div>
            <div className="field">
              <label className="label" htmlFor="o-note">Izoh (ixtiyoriy)</label>
              <input id="o-note" className="input" value={form.note} onChange={set("note")} />
            </div>

            {error && <div className="alert-error" role="alert">{error}</div>}

            <div className="total-row">
              <span className="muted">Jami</span>
              <b>{formatPrice(total)}</b>
            </div>
            <button type="submit" className="btn btn-accent btn-lg" disabled={busy}>
              {busy ? "Yuborilmoqda..." : "Buyurtma berish"}
            </button>
            {!user && <p className="muted small">Kirmasdan ham buyurtma berishingiz mumkin. Kirsangiz, buyurtmalaringiz tarixini ko'ra olasiz.</p>}
          </form>
        </div>
      )}
    </div>
  );
}