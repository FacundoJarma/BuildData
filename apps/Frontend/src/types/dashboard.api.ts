
export interface ApiDashboardResponse {
  obra: ApiObraInfo;
  stats: ApiDashboardStats;
  budget: ApiBudgetOverview;
  budgetBreakdown: ApiBudgetItem[];
  tradeProgress: ApiTradeProgress[];
  activityFeed: ApiActivityFeedItem[];
  alerts: ApiAlertItem[];
  tasks: ApiTaskItem[];
  orders: ApiOrderItem[];
}

export interface ApiTaskItem {
  id: string;
  titulo: string;
  estado: string;
  prioridad: string;
  porcentaje_avance: number;
  fecha_inicio: string;
  fecha_limite: string;
}

export interface ApiOrderItemDetail {
  material_id: string;
  cantidad: number;
  precio_unitario: number;
}

export interface ApiOrderItem {
  id: string;
  estado: string;
  aprobado: boolean;
  fecha: string;
  proveedor_id: string;
  items: ApiOrderItemDetail[];
}

export interface ApiObraInfo {
  name: string;
  lastUpdate: string; // ISO 8601 — ej: "2025-05-20T10:32:00Z"
}

export interface ApiDashboardStats {
  avanceTotal: number;        // 0-100
  avanceDeltaPct: number;     // ej: 4 (el front formatea como "+4% esta semana")
  alertasCriticas: number;
  alertasDeltaHoy: number;    // ej: 1 (el front formatea como "+1 hoy")
  pedidos: number;
  pedidosPendientes: number;
  tareasCompletadas: number;
  tareasTotal: number;
}

export interface ApiBudgetOverview {
  total: number;              // en centavos o unidad mínima de la moneda
  ejecutado: number;
  disponible: number;
  ejecutadoPct: number;       // 0-100
  comprometidoPct: number;    // 0-100
  librePct: number;           // 0-100
  updatedAt: string;          // ISO 8601
}

export interface ApiBudgetItem {
  name: string;
  spent: number;
  cap: number;
  // "over" y "overPct" los calcula el FRONT (spent > cap), no los manda el back
}

export interface ApiTradeProgress {
  name: string;
  pct: number;               // 0-100
  // "color" lo asigna el FRONT según el rubro, no lo manda el back
}

export interface ApiActivityFeedItem {
  initials: string;           // o bien el back lo manda, más simple
  name: string;
  action: string;
  timestamp: string;          // ISO 8601 — el front formatea como "08:42"
}

export interface ApiAlertItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;          // ISO 8601 — el front formatea como "12 min", "2 h"
  severity: "critical" | "attention"; // el front mapea severity → tone
}