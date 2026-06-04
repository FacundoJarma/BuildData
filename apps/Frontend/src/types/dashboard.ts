export interface DashboardData {
  obra: ObraInfo;
  stats: DashboardStats;
  budget: BudgetOverview;
  budgetBreakdown: BudgetItem[];
  tradeProgress: TradeProgress[];
  activityFeed: ActivityFeedItem[];
  alerts: AlertItem[];
}

export interface ObraInfo {
  name: string;
  sector: string;
  lastUpdate: string;
}

export interface DashboardStats {
  avanceTotal: number;
  avanceDelta: string;
  alertasCriticas: number;
  alertasDelta: string;
  pedidos: number;
  pedidosPendientes: number;
  tareasCompletadas: number;
  tareasTotal: number;
}

export interface BudgetOverview {
  total: number;
  ejecutado: number;
  disponible: number;
  ejecutadoPct: number;
  comprometidoPct: number;
  librePct: number;
  updatedAt: string;
}

export interface BudgetItem {
  name: string;
  spent: number;
  cap: number;
  over: boolean;
  overPct?: number;
}

export interface TradeProgress {
  name: string;
  pct: number;
  color: string;
}

export interface ActivityFeedItem {
  initials: string;
  name: string;
  action: string;
  time: string;
}

export interface AlertItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  tone: "critical" | "attention";
}
