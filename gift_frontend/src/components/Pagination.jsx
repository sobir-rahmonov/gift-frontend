export default function Pagination({ page, count, pageSize = 12, onChange }) {
  const pages = Math.ceil(count / pageSize);
  if (pages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Sahifalar">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>Oldingi</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={p === page ? "on" : ""}
          aria-current={p === page ? "page" : undefined}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button disabled={page >= pages} onClick={() => onChange(page + 1)}>Keyingi</button>
    </nav>
  );
}