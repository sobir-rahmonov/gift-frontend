import { useEffect, useState } from "react";
import api from "../../api/client";
import Pagination from "../../components/Pagination";
import StatusBadge from "../../components/StatusBadge";
import { STATUSES, errorText, formatDate, formatPrice } from "../../utils/format";

const TABS = [["", "Hammasi"], ...Object.entries(STATUSES).map(([k, v]) => [k, v.label])];

export default function AdminOrders() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ count: 0, results: [] });
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = new URLSearchParams({ page });
    if (status) q.set("status", status);
    api
      .get(`/orders/?${q.toString()}`)
      .then((r) => {
        setData(r.data);
        setSelectedId((prev) =>
          r.data.results.some((o) => o.id === prev) ? prev : r.data.results[0]?.id ?? null
        );
      })
      .catch(() => setError("Buyurtmalarni yuklab bo'lmadi."));
  }, [status, page]);

  const selected = data.results.find((o) => o.id === selectedId);

  const changeStatus = async (s) => {
    setError("");
    try {
      await api.patch(`/orders/${selected.id}/`, { status: s });
      setData((d) => ({
        ...d,
        results: d.results.map((o) => (o.id === selected.id ? { ...o, status: s } : o)),
      }));
    } catch (err) {
      setError(errorText(err));
    }
  };

  return (
    <>
      <div className="admin-head"><h1>Buyurtmalar</h1></div>

      <div className="chips tabs">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            className={"chip" + (status === k ? " on" : "")}
            aria-pressed={status === k}
            onClick={() => { setStatus(k); setPage(1); }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="orders-admin">
        <section className="table-wrap grow">
          <table className="table">
            <thead>
              <tr><th>№</th><th>Mijoz</th><th>Summa</th><th>Holat</th></tr>
            </thead>
            <tbody>
              {data.results.map((o) => (
                <tr
                  key={o.id}
                  className={"clickable" + (o.id === selectedId ? " sel" : "")}
                  onClick={() => setSelectedId(o.id)}
                >
                  <td><b>#{o.id}</b></td>
                  <td>
                    <b>{o.full_name}</b>
                    <div className="muted small">{formatDate(o.created_at)}</div>
                  </td>
                  <td><b>{formatPrice(o.total_price)}</b></td>
                  <td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
              {data.results.length === 0 && <tr><td colSpan="4" className="muted center">Buyurtmalar yo'q.</td></tr>}
            </tbody>
          </table>
          <Pagination page={page} count={data.count} onChange={setPage} />
        </section>

        {selected && (
          <aside className="order-detail">
            <div className="order-head">
              <h2>Buyurtma #{selected.id}</h2>
              <StatusBadge status={selected.status} />
            </div>
            <div>
              <b>{selected.full_name}</b>
              <div className="muted">{selected.phone}</div>
              <div className="muted">{selected.address}</div>
              {selected.note && <div className="muted small">Izoh: {selected.note}</div>}
            </div>
            <div className="order-lines">
              {selected.items.map((i) => (
                <div key={i.id} className="order-line">
                  <span>{i.gift_name} <span className="muted">× {i.quantity}</span></span>
                  <b>{formatPrice(i.subtotal)}</b>
                </div>
              ))}
              <div className="order-line order-total">
                <span>Jami</span>
                <b>{formatPrice(selected.total_price)}</b>
              </div>
            </div>
            <div>
              <div className="label">Holatni o'zgartirish</div>
              <div className="chips">
                {Object.entries(STATUSES)
                  .filter(([k]) => k !== "new")
                  .map(([k, v]) => (
                    <button key={k} className="btn btn-light btn-sm" disabled={selected.status === k} onClick={() => changeStatus(k)}>
                      {v.label}
                    </button>
                  ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}