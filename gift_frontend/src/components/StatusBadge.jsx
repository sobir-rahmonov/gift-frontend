import { STATUSES } from "../utils/format";

export default function StatusBadge({ status }) {
  const s = STATUSES[status] || { label: status, bg: "#eee", fg: "#333" };
  return (
    <span className="status" style={{ background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}