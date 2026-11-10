import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import StatusBadge from "../components/StatusBadge";
import { formatDate, formatPrice } from "../utils/format";

export default function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    api
      .get(`/orders/?page=${page}`)
      .then((r) => {
        setOrders((prev) => (page === 1 ? r.data.results : [...(prev || []), ...r.data.results]));
        setHasNext(Boolean(r.data.next));
      })
      .catch(() => setOrders((prev) => prev || []));
  }, [page]);

  return (
    <div className="container page">
      <h1 className="page-title">Buyurtmalarim</h1>
      {orders === null && <p className="muted">Yuklanmoqda...</p>}
      {orders && orders.length === 0 && (
        <div className="empty">
          Hali buyurtma yo'q. <Link to="/gifts" className="btn btn-dark btn-sm">Sovg'alarni ko'rish</Link>
        </div>
      )}
      <div className="orders">
        {orders?.map((o) => (
          <article key={o.id} className="order-card">
            <div className="order-head">
              <div>
                <b className="order-no">Buyurtma #{o.id}</b>
                <div className="muted small">{formatDate(o.created_at)}</div>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div className="order-lines">
              {o.items.map((i) => (
                <div key={i.id} className="order-line">
                  <span>{i.gift_name} <span className="muted">× {i.quantity}</span></span>
                  <b>{formatPrice(i.subtotal)}</b>
                </div>
              ))}
            </div>
            <div className="order-line order-total">
              <span>Jami</span>
              <b>{formatPrice(o.total_price)}</b>
            </div>
          </article>
        ))}
      </div>
      {hasNext && (
        <button className="btn btn-light" onClick={() => setPage(page + 1)}>Yana ko'rsatish</button>
      )}
    </div>
  );
}