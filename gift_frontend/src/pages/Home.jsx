import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import FinderForm from "../components/FinderForm";
import GiftCard from "../components/GiftCard";

const STEPS = [
  { n: "01", title: "Ma'lumot kiriting", text: "Kimga sovg'a olayotganingizni, uning yoshini va budjetingizni tanlang." },
  { n: "02", title: "Mos sovg'alarni ko'ring", text: "Tizim shu shartlarga mos sovg'alarni narx bo'yicha tartiblab beradi." },
  { n: "03", title: "Saqlang va buyurtma bering", text: "Yoqqanini sevimlilarga qo'shing yoki darrov savatga soling." },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    api.get("/categories/").then((r) => setCategories(r.data)).catch(() => {});
    api.get("/gifts/").then((r) => setGifts(r.data.results.slice(0, 8))).catch(() => {});
  }, []);

  return (
    <>
      <section className="container hero">
        <div className="hero-text">
          <span className="tag">Aqlli sovg'a tanlash</span>
          <h1>To'g'ri sovg'ani bir daqiqada toping.</h1>
          <p>Kimga olayotganingizni, yoshini va budjetni ayting. Qolganini biz tanlab beramiz.</p>
          <div className="hero-actions">
            <Link to="/gifts" className="btn btn-accent btn-lg">Sovg'alarni ko'rish</Link>
            <a href="#how" className="btn-link">Qanday ishlaydi</a>
          </div>
        </div>
        <FinderForm />
      </section>

      {categories.length > 0 && (
        <section className="container section">
          <div className="chips">
            {categories.map((c) => (
              <Link key={c.id} to={`/gifts?category=${c.slug}`} className="pill">
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container section">
        <div className="section-head">
          <h2 className="section-title">Yangi sovg'alar</h2>
          <Link to="/gifts" className="btn btn-light btn-sm">Hammasi</Link>
        </div>
        {gifts.length === 0 ? (
          <div className="empty">Hozircha sovg'alar yo'q.</div>
        ) : (
          <div className="grid">
            {gifts.map((g) => <GiftCard key={g.id} gift={g} />)}
          </div>
        )}
      </section>

      <section id="how" className="container section">
        <div className="how">
          <h2 className="section-title">Qanday ishlaydi</h2>
          <div className="how-grid">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="how-n">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}