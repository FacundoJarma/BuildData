export const TASK_STATE_MAP: Record<string, { bg: string; fg: string; label: string; tint: string; dot: string }> = {
  done:     { bg: '#22C55E', fg: '#fff',     label: 'Completado',  tint: 'bg-success-50 text-[#15803D]',  dot: '#22C55E' },
  progress: { bg: '#0F4395', fg: '#fff',     label: 'En curso',    tint: 'bg-primary-50 text-primary',   dot: '#0F4395' },
  late:     { bg: '#EF4444', fg: '#fff',     label: 'Retraso',     tint: 'bg-critical-50 text-[#B91C1C]', dot: '#EF4444' },
  planned:  { bg: '#EFF6FF', fg: '#1D4ED8',  label: 'Programado',  border: '#3B82F6', tint: 'bg-info-50 text-[#1D4ED8]', dot: '#3B82F6' },
};

export const RUBRO_COLORS: Record<string, string> = {
  'Movimiento de suelos': '#94A3B8',
  'Hormigón armado':      '#0F4395',
  'Mampostería':          '#22C55E',
  'Instalaciones':        '#3B82F6',
};

export const WEEK_START_IDX = 8;
export const WEEK_COUNT     = 30;
export const TODAY_WEEK     = 20;
export const TODAY_COL      = (TODAY_WEEK - WEEK_START_IDX) + 0.4;

export const GANTT_START = new Date(2025, 1, 17);

export function weekDate(weekIdx: number, dayOffset = 0) {
  const d = new Date(GANTT_START);
  d.setDate(d.getDate() + weekIdx * 7 + dayOffset);
  return d;
}

export function fmtDate(d: Date) {
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
}

export function fmtDateLong(d: Date) {
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
}

const TASK_OFFSET = 7;

export interface TaskItem {
  id: string;
  name: string;
  who: string;
  start: number;
  span: number;
  state: string;
  pct: number;
  desc: string;
  cost: string;
  deps: string[];
  rubro: string;
  completedBy?: string;
  completedOn?: string;
}

export interface TaskGroup {
  rubro: string;
  items: TaskItem[];
}

export const INITIAL_GROUPS: TaskGroup[] = [
  { rubro: 'Movimiento de suelos', items: [
    { id: 'mov-01', name: 'Excavación general',     who: 'C. Ríos',    start: 0 + TASK_OFFSET, span: 2, state: 'done',     pct: 100, desc: 'Retiro de 2.400 m³ de tierra del solar. Movimiento concluido sin imprevistos.', cost: 'AR$ 4,2 M', deps: [] },
    { id: 'mov-02', name: 'Cimentación pilotes',    who: 'C. Ríos',    start: 1 + TASK_OFFSET, span: 3, state: 'done',     pct: 100, desc: '48 pilotes de hormigón armado, profundidad 12 m. Ensayos PIT aprobados.',     cost: 'AR$ 9,1 M', deps: ['mov-01'] },
  ]},
  { rubro: 'Hormigón armado', items: [
    { id: 'horm-01', name: 'Hormigonado losa +1',   who: 'L. Benítez', start: 2 + TASK_OFFSET, span: 3, state: 'done',     pct: 100, desc: 'Losa nivel +1, 22 m³ de hormigón H21. Probetas con resistencia 26 MPa.',       cost: 'AR$ 6,8 M', deps: ['mov-02'] },
    { id: 'horm-02', name: 'Hormigonado losa +2',   who: 'L. Benítez', start: 3 + TASK_OFFSET, span: 3, state: 'done',     pct: 100, desc: 'Losa nivel +2, 24 m³ H21. Curado completado sin fisuras.',                       cost: 'AR$ 7,3 M', deps: ['horm-01'] },
    { id: 'horm-03', name: 'Hormigonado losa +3',   who: 'L. Benítez', start: 4 + TASK_OFFSET, span: 4, state: 'progress', pct: 62,  desc: 'En curso · 28 m³ planeados, 17 m³ vertidos. Próximo paño previsto para el viernes.', cost: 'AR$ 8,1 M', deps: ['horm-02'] },
    { id: 'horm-04', name: 'Columnas eje 4-6',      who: 'L. Benítez', start: 5 + TASK_OFFSET, span: 3, state: 'late',     pct: 30,  desc: 'Retrasada 3 días por faltante de hierro 12 mm. Pedido PED-0141 sin aprobar.',     cost: 'AR$ 4,5 M', deps: ['horm-03'] },
  ]},
  { rubro: 'Mampostería', items: [
    { id: 'mamp-01', name: 'Tabiquería interior',   who: 'P. Salas',   start: 6 + TASK_OFFSET, span: 4, state: 'planned',  pct: 0,   desc: 'Tabiques 12 cm en ladrillo hueco. 1.200 m² previstos en 6 semanas.',              cost: 'AR$ 12,4 M', deps: ['horm-04'] },
    { id: 'mamp-02', name: 'Cierres exteriores',    who: 'P. Salas',   start: 7 + TASK_OFFSET, span: 4, state: 'planned',  pct: 0,   desc: 'Muros perimetrales 20 cm con aislación. Termina con revoque grueso exterior.',     cost: 'AR$ 9,9 M', deps: ['mamp-01'] },
  ]},
  { rubro: 'Instalaciones', items: [
    { id: 'inst-01', name: 'Tendido eléctrico',     who: 'M. Ortiz',   start: 7 + TASK_OFFSET, span: 5, state: 'planned',  pct: 0,   desc: 'Cañería corrugada, cableado por sectores, tablero general en planta baja.',        cost: 'AR$ 11,2 M', deps: ['mamp-01'] },
    { id: 'inst-02', name: 'Sanitarios',            who: 'M. Ortiz',   start: 8 + TASK_OFFSET, span: 4, state: 'planned',  pct: 0,   desc: 'Provisión de agua fría/caliente, desagües, ventilaciones. Termotanques en azotea.', cost: 'AR$ 8,6 M', deps: ['mamp-01'] },
  ]},
];

export const PEOPLE = ['C. Ríos', 'L. Benítez', 'P. Salas', 'M. Ortiz', 'A. Gómez'];
