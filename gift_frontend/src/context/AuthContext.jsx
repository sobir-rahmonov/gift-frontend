import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me/")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const saveSession = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async (username, password) => {
    const res = await api.post("/auth/login/", { username, password });
    return saveSession(res.data);
  };

  const register = async (username, email, password) => {
    const res = await api.post("/auth/register/", { username, email, password });
    return saveSession(res.data);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout/");
    } catch {
      // token allaqachon yaroqsiz bo'lsa ham chiqib ketaveramiz
    }
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}