import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/client";
import { EditIcon, GiftIcon, PlusIcon, TrashIcon } from "../../components/Icons";
import Pagination from "../../components/Pagination";
import { RECIPIENTS, errorText, formatPrice } from "../../utils/format";

function GiftForm({ gift, categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: gift?.name ?? "",
    description: gift?.description ?? "",
    price: gift ? String(Math.round(Number(gift.price))) : "",
    category: gift?.category ?? categories[0]?.id ?? "",
    recipient: gift?.recipient ?? "any",
    min_age: gift?.min_age ?? 0,
    max_age: gift?.max_age ?? 100,
    is_active: gift?.is_active ?? true,
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("image", file);
    try {
      if (gift) await api.patch(`/gifts/${gift.id}/`, fd);
      else await api.post("/gifts/", fd);
      onSaved();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={gift ? "Sovg'ani tahrirlash" : "Yangi sovg'a"}>
      <form className="modal-panel" onSubmit={submit}>
        <h2>{gift ? "Sovg'ani tahrirlash" : "Yangi sovg'a"}</h2>

        <div className="field">
          <label className="label" htmlFor="g-name">Nomi</label>
          <input id="g-name" className="input" value={form.name} onChange={set("name")} required />
        </div>
        <div className="field">
          <label className="label" htmlFor="g-desc">Tavsif</label>
          <textarea id="g-desc" className="input" rows="3" value={form.description} onChange={set("description")} />
        </div>
        <div className="two">
          <div className="field">
            <label className="label" htmlFor="g-price">Narxi, so'm</label>
            <input id="g-price" className="input" inputMode="numeric" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, "") })} required />
          </div>
          <div className="field">
            <label className="label" htmlFor="g-cat">Kategoriya</label>
            <select id="g-cat" className="input" value={form.category} onChange={set("category")} required>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="two">
          <div className="field">
            <label className="label" htmlFor="g-rec">Kimga</label>
            <select id="g-rec" className="input" value={form.recipient} onChange={set("recipient")}>
              {RECIPIENTS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div className="two">
            <div className="field">
              <label className="label" htmlFor="g-min">Yosh dan</label>
              <input id="g-min" className="input" type="number" min="0" value={form.min_age} onChange={set("min_age")} />
            </div>
            <div className="field">
              <label className="label" htmlFor="g-max">gacha</label>
              <input id="g-max" className="input" type="number" min="0" value={form.max_age} onChange={set("max_age")} />
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="g-img">Rasm {gift?.image && "(yangi tanlasangiz almashadi)"}</label>
          <input id="g-img" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
        </div>
        <label className="check">
          <input type="checkbox" checked={form.is_active} onChange={set("is_active")} />
          Faol (saytda ko'rinadi)
        </label>

        {error && <div className="alert-error" role="alert">{error}</div>}

        <div className="modal-actions">
          <button type="submit" className="btn btn-accent" disabled={busy}>{busy ? "Saqlanmoqda..." : "Saqlash"}</button>
          <button type="button" className="btn btn-light" onClick={onClose}>Bekor</button>
        </div>
      </form>
    </div>
  );
}

export default function AdminGifts() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ count: 0, results: [] });
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null); // null | "new" | gift
  const [msg, setMsg] = useState("");

  const query = params.toString();
  const page = Number(params.get("page") || 1);

  const load = useCallback(() => {
    api.get(`/gifts/?${query}`).then((r) => setData(r.data)).catch(() => setMsg("Ro'yxatni yuklab bo'lmadi."));
  }, [query]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    api.get("/categories/").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const toggleActive = async (g) => {
    setMsg("");
    try {
      await api.patch(`/gifts/${g.id}/`, { is_active: !g.is_active });
      load();
    } catch (err) {
      setMsg(errorText(err));
    }
  };

  const remove = async (g) => {
    if (!window.confirm(`"${g.name}" o'chirilsinmi?`)) return;
    setMsg("");
    try {
      await api.delete(`/gifts/${g.id}/`);
      load();
    } catch {
      setMsg(`"${g.name}" buyurtmalarda ishlatilgan bo'lishi mumkin, uni o'chirib bo'lmaydi. Buning o'rniga uni nofaol qiling.`);
    }
  };

  const search = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("search");
    setParams(q ? { search: q } : {});
  };

  return (
    <>
      <div className="admin-head">
        <h1>Sovg'alar</h1>
        <button className="btn btn-accent" onClick={() => setEditing("new")}>
          <PlusIcon /> Yangi sovg'a
        </button>
      </div>

      <form onSubmit={search} className="admin-search" key={params.get("search") || ""}>
        <input className="input" name="search" type="search" placeholder="Qidirish" defaultValue={params.get("search") || ""} aria-label="Qidirish" />
      </form>

      {msg && <div className="alert-error">{msg}</div>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th><span className="sr">Rasm</span></th>
              <th>Nomi</th>
              <th>Kategoriya</th>
              <th>Narxi</th>
              <th>Faol</th>
              <th><span className="sr">Amallar</span></th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((g) => (
              <tr key={g.id}>
                <td>
                  <div className="thumb">
                    {g.image ? <img src={g.image} alt="" /> : <GiftIcon stroke="#b9b9b0" width="22" height="22" />}
                  </div>
                </td>
                <td>
                  <b>{g.name}</b>
                  <div className="muted small">{g.recipient_display}, {g.min_age}–{g.max_age} yosh</div>
                </td>
                <td className="muted">{g.category_name}</td>
                <td><b>{formatPrice(g.price)}</b></td>
                <td>
                  <button
                    className={"switch" + (g.is_active ? " on" : "")}
                    role="switch"
                    aria-checked={g.is_active}
                    aria-label={g.is_active ? "Faol" : "Nofaol"}
                    onClick={() => toggleActive(g)}
                  >
                    <span />
                  </button>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn" aria-label="Tahrirlash" onClick={() => setEditing(g)}><EditIcon /></button>
                    <button className="icon-btn danger" aria-label="O'chirish" onClick={() => remove(g)}><TrashIcon /></button>
                  </div>
                </td>
              </tr>
            ))}
            {data.results.length === 0 && (
              <tr><td colSpan="6" className="muted center">Sovg'alar yo'q.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        count={data.count}
        onChange={(p) => {
          const next = new URLSearchParams(params);
          next.set("page", p);
          setParams(next);
        }}
      />

      {editing && (
        <GiftForm
          gift={editing === "new" ? null : editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </>
  );
}