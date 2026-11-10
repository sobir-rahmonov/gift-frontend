const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const GiftIcon = (p) => (
  <svg {...base} width="28" height="28" stroke="var(--accent)" {...p}>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M5 12v8h14v-8" />
    <path d="M12 8v12" />
    <path d="M12 8c-2.5 0-4-1-4-2.5S9.5 3 11 4.5L12 8z" />
    <path d="M12 8c2.5 0 4-1 4-2.5S14.5 3 13 4.5L12 8z" />
  </svg>
);

export const HeartIcon = ({ filled, ...p }) => (
  <svg {...base} fill={filled ? "currentColor" : "none"} {...p}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </svg>
);

export const BagIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const SearchIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </svg>
);

export const TrashIcon = (p) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V4h6v3" />
    <path d="M6 7l1 13h10l1-13" />
  </svg>
);

export const EditIcon = (p) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M4 20h4L19 9l-4-4L4 16v4z" />
  </svg>
);

export const PlusIcon = (p) => (
  <svg {...base} width="18" height="18" strokeWidth="2.2" {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);