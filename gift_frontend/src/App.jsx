import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import { RequireAdmin, RequireAuth } from "./components/Guards";

import Home from "./pages/Home";
import Finder from "./pages/Finder";
import Catalog from "./pages/Catalog";
import GiftDetail from "./pages/GiftDetail";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminGifts from "./pages/admin/AdminGifts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";

import "./pages/pages.css";
import "./pages/admin/admin.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/gifts" element={<Catalog />} />
                <Route path="/gifts/:id" element={<GiftDetail />} />
                <Route path="/finder" element={<Finder />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/favorites" element={<RequireAuth><Favorites /></RequireAuth>} />
                <Route path="/orders" element={<RequireAuth><MyOrders /></RequireAuth>} />
              </Route>

              <Route path="/login" element={<Login />} />

              <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                <Route index element={<Navigate to="gifts" replace />} />
                <Route path="gifts" element={<AdminGifts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}