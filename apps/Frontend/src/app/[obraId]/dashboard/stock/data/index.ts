export interface StockItem {
  id: string;
  name: string;
  cat: string;
  unit: string;
  qty: number;
  min: number;
  loc: string;
  photo: string;
}

export const ITEMS: StockItem[] = [
  { id: 's1', name: 'Cemento Portland 50 kg', cat: 'Áridos y cementos', unit: 'bolsas', qty: 84,  min: 40,  loc: 'Depósito A', photo: '' },
  { id: 's2', name: 'Arena fina',             cat: 'Áridos y cementos', unit: 'm³',     qty: 12,  min: 8,   loc: 'Playa', photo: '' },
  { id: 's3', name: 'Hierro 12 mm × 12 m',    cat: 'Hierros',           unit: 'barras', qty: 18,  min: 60,  loc: 'Depósito B', photo: '' },
  { id: 's4', name: 'Hierro 8 mm × 12 m',     cat: 'Hierros',           unit: 'barras', qty: 120, min: 50,  loc: 'Depósito B', photo: '' },
  { id: 's5', name: 'Ladrillo cerámico 18×18',cat: 'Mampostería',       unit: 'u',      qty: 3200,min: 2000,loc: 'Playa', photo: '' },
  { id: 's6', name: 'Cal hidratada 25 kg',    cat: 'Mampostería',       unit: 'bolsas', qty: 26,  min: 30,  loc: 'Depósito A', photo: '' },
  { id: 's7', name: 'Cable 3×6 mm',           cat: 'Eléctrico',         unit: 'm',      qty: 240, min: 100, loc: 'Pañol', photo: '' },
  { id: 's8', name: 'Caño PVC 110 mm',        cat: 'Sanitario',         unit: 'u',      qty: 14,  min: 20,  loc: 'Pañol', photo: '' },
];

export const CATEGORIES = ['Áridos y cementos', 'Hierros', 'Mampostería', 'Eléctrico', 'Sanitario'];

export const CAT_COLORS: Record<string, string> = {
  'Áridos y cementos': '#94A3B8',
  'Hierros':           '#0F4395',
  'Mampostería':       '#22C55E',
  'Eléctrico':         '#F59E0B',
  'Sanitario':         '#3B82F6',
};

export function getStatus(item: StockItem) {
  if (item.qty <= 0) return 'out';
  if (item.qty < item.min) return 'low';
  return 'ok';
}

export const STAT_LABELS: Record<string, { label: string; tone: string; dot: string }> = {
  ok:  { label: 'OK',      tone: 'success',        dot: '#22C55E' },
  low: { label: 'BAJO',    tone: 'attentionSolid', dot: '#F59E0B' },
  out: { label: 'SIN STOCK', tone: 'criticalSolid', dot: '#EF4444' },
};
