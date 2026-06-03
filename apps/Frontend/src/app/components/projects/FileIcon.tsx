const PALETTES: Record<string, { bg: string; fg: string; label: string }> = {
  pdf:  { bg: "#FEF2F2", fg: "#B91C1C", label: "PDF" },
  xlsx: { bg: "#F0FDF4", fg: "#15803D", label: "XLSX" },
  doc:  { bg: "#EFF6FF", fg: "#1D4ED8", label: "DOC" },
  img:  { bg: "#FFFBEB", fg: "#B45309", label: "IMG" },
};

export function FileIcon({ kind, size = 36 }: { kind: string; size?: number }) {
  const p = PALETTES[kind] || PALETTES.doc;
  return (
    <div
      className="rounded-md flex flex-col items-center justify-center font-extrabold text-[10px] tracking-wider"
      style={{ width: size, height: size * 1.2, background: p.bg, color: p.fg }}
    >
      {p.label}
    </div>
  );
}
