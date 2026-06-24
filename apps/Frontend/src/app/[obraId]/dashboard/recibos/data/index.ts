export interface ReciboItem {
  id: string;
  concept: string;
  prov: string;
  cat: string;
  date: string;
  amount: number;
  status: string;
  file: string;
}

export const RECEIPTS: ReciboItem[] = [
  { id: 'r1', concept: 'Cemento × 120 bolsas',  prov: 'Cementos del Plata', cat: 'Materiales',  date: '15 May', amount: 480000,  status: 'pagado',     file: 'recibo-0142.pdf' },
  { id: 'r2', concept: 'Hierro 12 mm × 2,5 t',   prov: 'Aceros Norte',       cat: 'Materiales',  date: '12 May', amount: 1250000, status: 'pendiente',  file: 'factura-A-883.pdf' },
  { id: 'r3', concept: 'Alquiler grúa torre',    prov: 'GruasSur SRL',       cat: 'Equipos',     date: '10 May', amount: 890000,  status: 'pagado',     file: 'recibo-grua-05.pdf' },
  { id: 'r4', concept: 'Jornales cuadrilla S19', prov: 'Nómina interna',     cat: 'Mano de obra', date: '08 May', amount: 1640000, status: 'pagado',     file: 'liquidacion-s19.pdf' },
  { id: 'r5', concept: 'Flete áridos',           prov: 'Transportes Río',    cat: 'Logística',   date: '06 May', amount: 220000,  status: 'pendiente',  file: 'remito-3920.pdf' },
  { id: 'r6', concept: 'Pintura látex × 40 L',   prov: 'Pinturas Capital',   cat: 'Materiales',  date: '03 May', amount: 145000,  status: 'pagado',     file: 'recibo-0138.pdf' },
];

export const CATEGORIES = ['Materiales', 'Mano de obra', 'Equipos', 'Logística', 'Servicios'];

export const FILTERS = ['Todos', 'Pendientes', ...CATEGORIES];

export const CAT_TINT: Record<string, string> = {
  'Materiales':   'bg-primary-50 text-primary',
  'Mano de obra': 'bg-success-50 text-[#15803D]',
  'Equipos':      'bg-info-50 text-[#1D4ED8]',
  'Logística':    'bg-attention-50 text-[#A16207]',
  'Servicios':    'bg-slate-100 text-slate-700',
};

export function fmtCurrency(n: number) {
  return 'AR$ ' + (Number(n) || 0).toLocaleString('es-AR');
}
