import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import FinderForm from "../components/FinderForm";
import GiftCard from "../components/GiftCard";

export default function Finder() {
  const [params] = useSearchParams();
  const query = params.toString();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setData(null);
    api
      .get(`/gifts/finder/?${query}`)
      .then((r) => { if (!cancelled) { setData(r.data); setError(""); } })
      .catch(() => { if (!cancelled) setError("Natijalarni yuklab bo'lmadi."); });
    return () => { cancelled = true; };
  }, [query]);

  return (
    <div className="container page">
      <h1 className="page-title">Sovg'a topish</h1>
      <div className="finder-wrap">
        <FinderForm
          key={query}
          initial={{
            recipient: params.get("recipient") || "",
            age: params.get("age") || "",
            budget: params.get("budget") || "",
          }}
        />
      </div>

      {error && <div className="alert-error">{error}</div>}
      {!data && !error && <p className="muted">Qidirilmoqda...</p>}
      {data && (
        <>
          <p className="muted">{data.count} ta mos sovg'a topildi</p>
          {data.count === 0 ? (
            <div className="empty">Bu shartlarga mos sovg'a topilmadi. Budjetni oshirib yoki yoshni o'zgartirib ko'ring.</div>
          ) : (
            <div className="grid">
              {data.results.map((g) => <GiftCard key={g.id} gift={g} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}