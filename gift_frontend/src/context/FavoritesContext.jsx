import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [ids, setIds] = useState(new Set());

  useEffect(() => {
    if (!userId) {
      setIds(new Set());
      return;
    }
    api
      .get("/favorites/")
      .then((res) => setIds(new Set(res.data.map((f) => f.gift))))
      .catch(() => {});
  }, [userId]);

  const toggle = async (giftId) => {
    const res = await api.post("/favorites/toggle/", { gift: giftId });
    const isFav = res.data.is_favorite;
    setIds((prev) => {
      const next = new Set(prev);
      if (isFav) next.add(giftId);
      else next.delete(giftId);
      return next;
    });
    return isFav;
  };

  return (
    <FavoritesContext.Provider value={{ ids, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}