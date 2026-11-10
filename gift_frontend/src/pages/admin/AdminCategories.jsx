import { useCallback, useEffect, useState } from "react";
import api from "../../api/client";
import { EditIcon, TrashIcon } from "../../components/Icons";
import { errorText, slugify } from "../../utils/format";

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api.get("/categories/").then((r) => setCats(r.data)).catch(() => setError("Yuklab bo'lmadi."));
  }, []);

  useEffect(() => { load(); }, [load]);

  const reset = () => {
    setEditing(null);
    setName("");
    setSlug("");
    setSlugTouched(false);
  };

  const onName = (e) => {
    setName(e.target.value);
    if (!slugTouched) setSlug(slugify(e.target.value));
  };

  const startEdit = (c) => {
    setEditing(c);
    setName(c.name);
    setSlug(c.slug);
    setSlugTouched(true);
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) await api.patch(`/categories/${editing.id}/`, { name, slug });
      else await api.post("/categories/", { name, slug });
      reset();
      load();
    } catch (err) {
      setError(errorText(err));
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`"${c.name}" o'chirilsinmi?`)) return;
    setError("");
    try {
      await api.delete(`/categories/${c.id}/`);
      load();
    } catch {
      setError("Kategoriyani o'chirib bo'lmadi.");
    }
  };

  return (
    <>
      <div className="admin-head"><h1>Kategoriyalar</h1></div>

      <form className="cat-form" onSubmit={submit}>
        <div className="field">
          <label className="label" htmlFor="c-name">Nomi</label>
          <input id="c-name" className="input" value={name} onChange={onName} required />
        </div>
        <div className="field">
          <label className="label" htmlFor="c-slug">Slug (havola uchun)</label>
          <input id="c-slug" className="input" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} required />
        </div>
        <button type="submit" className="btn btn-accent">{editing ? "Saqlash" : "Qo'shish"}</button>
        {editing && <button type="button" className="btn btn-light" onClick={reset}>Bekor</button>}
      </form>

      {error && <div className="alert-error">{error}</div>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Nomi</th><th>Slug</th><th>Sovg'alar</th><th><span className="sr">Amallar</span></th></tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id}>
                <td><b>{c.name}</b></td>
                <td className="muted">{c.slug}</td>
                <td>{c.gift_count}</td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn" aria-label="Tahrirlash" onClick={() => startEdit(c)}><EditIcon /></button>
                    <button
                      className="icon-btn danger"
                      aria-label="O'chirish"
                      disabled={c.gift_count > 0}
                      title={c.gift_count > 0 ? "Ichida sovg'alar bor, avval ularni boshqa kategoriyaga o'tkazing" : ""}
                      onClick={() => remove(c)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {cats.length === 0 && <tr><td colSpan="4" className="muted center">Kategoriyalar yo'q.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}