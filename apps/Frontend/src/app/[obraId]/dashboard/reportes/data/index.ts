export interface SectionDef {
  id: string;
  label: string;
  sub: string;
  icon: string;
}

export const SECTION_DEFS: SectionDef[] = [
  { id: 'resumen',    label: 'Resumen ejecutivo',   sub: 'Estado general y KPIs de la obra',         icon: 'chart' },
  { id: 'avance',     label: 'Avance por rubro',    sub: 'Progreso de cada categoría',               icon: 'trending' },
  { id: 'presupuesto',label: 'Presupuesto',         sub: 'Ejecutado, comprometido y disponible',     icon: 'dollar' },
  { id: 'cronograma', label: 'Cronograma',          sub: 'Tareas completas, en curso y atrasadas',   icon: 'calendar' },
  { id: 'alertas',    label: 'Alertas e incidentes',sub: 'Problemas críticos del período',           icon: 'alert' },
  { id: 'pedidos',    label: 'Pedidos de material', sub: 'Compras y entregas',                       icon: 'package' },
  { id: 'stock',      label: 'Stock de materiales', sub: 'Inventario y niveles bajos',               icon: 'box' },
  { id: 'recibos',    label: 'Recibos y gastos',    sub: 'Comprobantes y pagos',                     icon: 'receipt' },
  { id: 'equipo',     label: 'Equipo',              sub: 'Personas y productividad',                 icon: 'users' },
  { id: 'actividad',  label: 'Bitácora de actividad',sub: 'Detalle día a día (extenso)',             icon: 'message' },
];

export const SNAPSHOT = {
  obra: 'Edificio Belgrano',
  code: 'OBR-2025-014',
  avance: 68,
  presupuestoTotal: 124,
  ejecutado: 81,
  tareas: { total: 10, done: 4, prog: 1, late: 1 },
  alertas: 2,
  pedidos: 7,
  stockLow: 2,
  recibosPend: 2,
  equipo: 6,
};

export const RANGE_LABELS: Record<string, string> = {
  semana: 'Última semana',
  mes: 'Último mes',
  trim: 'Último trimestre',
  total: 'Toda la obra',
};
