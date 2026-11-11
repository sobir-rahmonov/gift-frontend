# Gift Finder: Frontend

Sovg'a tanlash platformasining foydalanuvchi va admin interfeysi.
React (Vite) bilan yozilgan, backend REST API bilan ishlaydi.

## Imkoniyatlar

**Foydalanuvchi uchun**
- Bosh sahifa va **Sovg'a topish** formasi (kimga, yosh, budjet)
- Katalog: kategoriya, kimga va narx bo'yicha filter, qidiruv, saralash, sahifalash
- Sovg'a sahifasi, o'xshash sovg'alar
- Savat (brauzerda saqlanadi) va buyurtma berish, kirmasdan ham
- Kirish va ro'yxatdan o'tish
- Sevimlilar va buyurtmalar tarixi

**Admin uchun** (`/admin`)
- Sovg'alar: qo'shish, tahrirlash (rasm bilan), faol/nofaol qilish, o'chirish
- Kategoriyalar boshqaruvi
- Buyurtmalar: holat bo'yicha filter va holatni o'zgartirish

## Texnologiyalar

React, Vite, React Router, Axios, oddiy CSS (CSS o'zgaruvchilari bilan).

## Talablar

- Node.js 18 yoki yuqori
- Ishlab turgan backend (`gift_blok`), standart manzil: `http://127.0.0.1:8000`

## O'rnatish va ishga tushirish

```cmd
cd gift_frontend
npm install
npm run dev
```

Sayt `http://localhost:5173` da ochiladi.

Boshqa buyruqlar:

| Buyruq | Vazifasi |
|---|---|
| `npm run dev` | Ishlab chiqish serveri |
| `npm run build` | Productionga yig'ish (`dist/` papkasi) |
| `npm run preview` | Yig'ilgan versiyani ko'rish |
| `npm run lint` | Kodni tekshirish |

## Backend manzilini o'zgartirish

Manzil bitta joyda, `src/api/client.js` ichida:

```js
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});
```

Serverga joylaganda shu qiymatni haqiqiy manzilga almashtiring.

## Loyiha tuzilmasi

```
src/
├── main.jsx, App.jsx        # kirish nuqtasi va yo'llar
├── index.css                # umumiy uslublar va ranglar
├── api/client.js            # axios, tokenni avtomatik qo'shadi
├── context/
│   ├── AuthContext.jsx      # kirish, ro'yxatdan o'tish, chiqish
│   ├── CartContext.jsx      # savat (localStorage)
│   └── FavoritesContext.jsx # sevimlilar
├── utils/format.js          # narx, sana, xato matni, konstantalar
├── components/              # qayta ishlatiladigan qismlar
│   (Header, Footer, Layout, GiftCard, FinderForm,
│    Pagination, StatusBadge, Icons, Guards)
└── pages/
    ├── Home, Finder, Catalog, GiftDetail, Cart,
    │   Favorites, MyOrders, Login
    └── admin/ (AdminLayout, AdminGifts, AdminCategories, AdminOrders)
```

## Sahifalar

| Yo'l | Sahifa | Kim kira oladi |
|---|---|---|
| `/` | Bosh sahifa | hamma |
| `/gifts` | Katalog | hamma |
| `/gifts/:id` | Sovg'a tafsiloti | hamma |
| `/finder` | Sovg'a topish natijalari | hamma |
| `/cart` | Savat va buyurtma | hamma |
| `/login` | Kirish / ro'yxatdan o'tish | hamma |
| `/favorites` | Sevimlilar | kirgan foydalanuvchi |
| `/orders` | Mening buyurtmalarim | kirgan foydalanuvchi |
| `/admin/gifts` | Admin: sovg'alar | faqat admin |
| `/admin/categories` | Admin: kategoriyalar | faqat admin |
| `/admin/orders` | Admin: buyurtmalar | faqat admin |

## Kirish qanday ishlaydi

1. Kirganda backend token va `is_staff` ni qaytaradi.
2. Token `localStorage` da saqlanadi, `api/client.js` uni har so'rovga qo'shadi.
3. Sahifa yangilanganda `/auth/me/` orqali foydalanuvchi qayta tiklanadi.
4. `is_staff` bo'lsa, kirgandan keyin `/admin` ga o'tadi. Oddiy foydalanuvchi `/admin` ga kirmoqchi bo'lsa, bosh sahifaga qaytariladi.

Frontenddagi tekshiruvlar faqat qulaylik uchun. Haqiqiy himoya backendda.

## Eslatma

Savat brauzerda saqlanadi, buyurtma berilganda narx baribir serverda qayta hisoblanadi.



## Bog'liq loyiha

Backend: [gift_blok](https://github.com/sobir-rahmonov/gift_blok)
Frontend: [gift_frontend](https://github.com/sobir-rahmonovI/gift_frontend)

## Muallif

**ISM FAMILIYA**
GitHub: [@sobir-rahmonov](https://github.com/sobir-rahmonov)
Aloqa: email@example.com
