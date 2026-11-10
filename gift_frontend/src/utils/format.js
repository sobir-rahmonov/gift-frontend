export const formatPrice = (n) =>
  String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";

export const RECIPIENTS = [
  { value: "any", label: "Hamma uchun" },
  { value: "mother", label: "Ona" },
  { value: "father", label: "Ota" },
  { value: "wife", label: "Rafiqa" },
  { value: "husband", label: "Er" },
  { value: "friend", label: "Do'st" },
  { value: "child", label: "Bola" },
  { value: "colleague", label: "Hamkasb" },
];

// "Hamma uchun" siz (sovg'a topish formasi uchun)
export const PEOPLE = RECIPIENTS.filter((r) => r.value !== "any");

export const STATUSES = {
  new: { label: "Yangi", bg: "#E8EEF9", fg: "#2447A8" },
  confirmed: { label: "Tasdiqlandi", bg: "#FCEFD3", fg: "#7A4E00" },
  delivering: { label: "Yetkazilmoqda", bg: "#EFE6FA", fg: "#5B2CA0" },
  delivered: { label: "Yetkazildi", bg: "#E1F2E8", fg: "#17603E" },
  cancelled: { label: "Bekor qilindi", bg: "#FBE4E1", fg: "#A12A1B" },
};

export function formatDate(iso) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function collect(v) {
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.flatMap(collect);
  if (v && typeof v === "object") return Object.values(v).flatMap(collect);
  return [];
}

export function errorText(err) {
  const data = err.response?.data;
  if (!data) return "Serverga ulanib bo'lmadi. Backend ishlayaptimi?";
  return collect(data).join(" ") || "Xatolik yuz berdi.";
}

export function slugify(s) {
  return s
    .toLowerCase()
    .replace(/['‘’`ʻ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}