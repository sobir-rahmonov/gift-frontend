import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function errorText(err) {
  const data = err.response?.data;
  if (!data) return "Serverga ulanib bo'lmadi. Backend ishlayaptimi?";
  if (typeof data === "string") return "Xatolik yuz berdi.";
  return Object.values(data).flat().join(" ");
}

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = isLogin
        ? await login(username, password)
        : await register(username, email, password);
      navigate(user.is_staff ? "/admin" : "/");
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <aside className="auth-side">
        <Link to="/" className="auth-logo">Gift Finder</Link>
        <div>
          <h2>Sevimli sovg'alaringizni saqlab qo'ying.</h2>
          <p>Hisob oching: sevimlilar ro'yxati va buyurtmalaringiz tarixi doim yoningizda bo'ladi.</p>
        </div>
        <small>© 2026 Gift Finder</small>
      </aside>

      <main className="auth-main">
        <div className="auth-box">
          <div className="auth-tabs">
            <button type="button" className={isLogin ? "on" : ""} onClick={() => setMode("login")}>
              Kirish
            </button>
            <button type="button" className={!isLogin ? "on" : ""} onClick={() => setMode("register")}>
              Ro'yxatdan o'tish
            </button>
          </div>

          <h1>{isLogin ? "Qaytganingiz yaxshi" : "Hisob yarating"}</h1>

          <form onSubmit={submit}>
            <label htmlFor="u">Login</label>
            <input id="u" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />

            {!isLogin && (
              <>
                <label htmlFor="e">Email (ixtiyoriy)</label>
                <input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </>
            )}

            <label htmlFor="p">Parol</label>
            <input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isLogin ? "current-password" : "new-password"} required />

            {error && <div className="auth-error" role="alert">{error}</div>}

            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? "Kuting..." : isLogin ? "Kirish" : "Hisob yaratish"}
            </button>
          </form>

          <Link to="/" className="auth-back">← Bosh sahifaga qaytish</Link>
        </div>
      </main>
    </div>
  );
}