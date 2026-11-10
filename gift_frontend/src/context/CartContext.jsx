import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const KEY = "cart";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      // brauzer ruxsat bermasa, savat faqat shu sessiyada yashaydi
    }
  }, [items]);

  const add = (gift, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.id === gift.id);
      if (found) {
        return prev.map((i) =>
          i.id === gift.id ? { ...i, qty: Math.min(99, i.qty + qty) } : i
        );
      }
      return [
        ...prev,
        {
          id: gift.id,
          name: gift.name,
          price: Number(gift.price),
          image: gift.image,
          category_name: gift.category_name,
          qty,
        },
      ];
    });

  const setQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i
      )
    );

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}