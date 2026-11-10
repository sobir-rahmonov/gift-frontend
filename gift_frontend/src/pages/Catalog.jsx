import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import GiftCard from "../components/GiftCard";
import Pagination from "../components/Pagination";
import { SearchIcon } from "../components/Icons";
import { RECIPIENTS } from "../utils/format";

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = params.toString();
  const page = Number(params.get("page") || 1);
  const category = params.get("category") || "";
  const recipient = params.get("recipient") || "";

  useEffect(() => {
    api.get("/categories/").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/gifts/?${query}`)
      .then((r) => { if (!cancelled) { setData(r.data); setError(""); } })
      .catch(() => { if (!cancelled) setError("Sovg'alarni yuklab bo'lmadi."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [query]);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => {
      if (v === "" || v == null) next.delete(k);
      else next.set(k, v);
    });
    if (!("page" in changes)) next.delete("page");
    setParams(next);
  };

  const applyPrice = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    update({ min_price: f.get("min_price"), max_price: f.get("max_price") });
  };

  const applySearch = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    update({ search: f.get("search") });
  };

  return (
    <div className="container page">
      <h1 className="page-title">Barcha sovg'alar</h1>

      <div className="catalog">
        <aside className="filters">
          <div>
            <div className="label">Kategoriya</div>
            <button className={"opt" + (category === "" ? " on" : "")} onClick={() => update({ category: "" })}>
              Hammasi
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={"opt" + (category === c.slug ? " on" : "")}
                onClick={() => update({ category: c.slug })}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div>
            <div className="label">Kimga</div>
            <div className="chips">
              {RECIPIENTS.map((r) => (
                <button
                  key={r.value}
                  className={"chip chip-sm" + (recipient === r.value ? " on" : "")}
                  aria-pressed={recipient === r.value}
                  onClick={() => update({ recipient: recipient === r.value ? "" : r.value })}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <form key={`${params.get("min_price")}-${params.get("max_price")}`} onSubmit={applyPrice}>
            <div className="label">Narx, so'm</div>
            <div className="price-row">
              <input className="input input-sm" name="min_price" inputMode="numeric" placeholder="dan" defaultValue={params.get("min_price") || ""} aria-label="Eng kam narx" />
              <input className="input input-sm" name="max_price" inputMode="numeric" placeholder="gacha" defaultValue={params.get("max_price") || ""} aria-label="Eng yuqori narx" />
            </div>
            <button type="submit" className="btn btn-accent btn-sm full">Qo'llash</button>
          </form>

          <button className="btn-link" onClick={() => setParams({})}>Hammasini tozalash</button>
        </aside>

        <section className="catalog-main">
          <div className="toolbar">
            <form key={params.get("search") || ""} onSubmit={applySearch} className="search">
              <SearchIcon className="search-ic" width="20" height="20" />
              <input className="input" name="search" type="search" placeholder="Sovg'a nomi bo'yicha qidirish" defaultValue={params.get("search") || ""} aria-label="Qidirish" />
            </form>
            <select
              className="input select"
              aria-label="Saralash"
              value={params.get("ordering") || ""}
              onChange={(e) => update({ ordering: e.target.value })}
            >
              <option value="">Yangilari birinchi</option>
              <option value="price">Avval arzonlari</option>
              <option value="-price">Avval qimmatlari</option>
            </select>
          </div>

          {error && <div className="alert-error">{error}</div>}
          {loading && <p className="muted">Yuklanmoqda...</p>}
          {!loading && !error && (
            <>
              <p className="muted">{data.count} ta sovg'a</p>
              {data.results.length === 0 ? (
                <div className="empty">Hech narsa topilmadi.</div>
              ) : (
                <div className="grid">
                  {data.results.map((g) => <GiftCard key={g.id} gift={g} />)}
                </div>
              )}
              <Pagination page={page} count={data.count} onChange={(p) => update({ page: p })} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}