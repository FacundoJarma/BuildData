
// ======================================
// ENUMS
// ======================================

export type ObraStatus =
  | "planificacion"
  | "en_progreso"
  | "pausada"
  | "finalizada";

export type TaskStatus =
  | "pendiente"
  | "en_progreso"
  | "completada";

export type TaskPriority =
  | "baja"
  | "media"
  | "alta"
  | "critica";

export type PedidoStatus =
  | "pendiente"
  | "en_progreso"
  | "completado"
  | "cancelado";

export type BudgetTransactionType =
  | "ingreso"
  | "egreso"
  | "ajuste";

export type MaterialMovementType =
  | "entrada"
  | "salida"
  | "ajuste";

export type AlertType =
  | "critica"
  | "advertencia"
  | "info";

export type AlertCategory =
  | "stock_bajo"
  | "tarea_vencida"
  | "presupuesto_excedido"
  | "pedido_atrasado";

export type ActivityEntity =
  | "task"
  | "pedido"
  | "budget"
  | "material"
  | "obra"
  | "alert"
  | "worker";


// ======================================
// BASE
// ======================================

export interface BaseEntity {
  id: string;

  createdAt: string;
  updatedAt?: string;
}


// ======================================
// OBRAS
// ======================================

export interface Obra extends BaseEntity {
  name: string;

  code: string;

  address: string;

  sector: string;

  status: ObraStatus;

  starred: boolean;

  progressPercent: number;

  startDate?: string;

  estimatedEndDate?: string;

  realEndDate?: string;
}


// ======================================
// OBREROS
// ======================================

export interface Worker extends BaseEntity {
  name: string;

  phone: string;

  email?: string;

  active: boolean;

  // si tiene cuenta de supabase
  profileId?: string;
}


// ======================================
// OBREROS DENTRO DE OBRA
// ======================================

export interface ObraWorker extends BaseEntity {
  obraId: string;

  workerId: string;

  role: string;

  joinedAt: string;
}


// ======================================
// RUBROS
// ======================================

export interface BudgetCategory extends BaseEntity {
  obraId: string;

  name: string;

  allocatedAmount: number;

  spentAmount: number;

  color?: string;
}


// ======================================
// TAREAS
// ======================================

export interface Task extends BaseEntity {
  obraId: string;

  budgetCategoryId: string;

  title: string;

  description?: string;

  status: TaskStatus;

  priority: TaskPriority;

  progressPercent: number;

  startDate?: string;

  dueDate?: string;

  completedAt?: string;

  estimatedHours?: number;

  createdByWorkerId?: string;
}


// ======================================
// SUBTASKS
// ======================================

export interface Subtask extends BaseEntity {
  taskId: string;

  title: string;

  description?: string;

  status: TaskStatus;

  progressPercent: number;

  orderIndex: number;
}


// ======================================
// PRESUPUESTO GENERAL
// ======================================

export interface Budget extends BaseEntity {
  obraId: string;

  total: number;

  currency: string;
}


// ======================================
// MOVIMIENTOS DE PRESUPUESTO
// ======================================

export interface BudgetTransaction extends BaseEntity {
  obraId: string;

  budgetCategoryId: string;

  type: BudgetTransactionType;

  amount: number;

  description: string;

  createdByWorkerId?: string;
}


// ======================================
// MATERIALES
// ======================================

export interface Material extends BaseEntity {
  name: string;

  unit: string;

  category?: string;

  currentStock: number;

  minimumStock?: number;
}


// ======================================
// MOVIMIENTOS DE STOCK
// ======================================

export interface MaterialMovement extends BaseEntity {
  materialId: string;

  type: MaterialMovementType;

  quantity: number;

  reason?: string;

  relatedPedidoId?: string;

  createdByWorkerId?: string;
}


// ======================================
// PROVEEDORES
// ======================================

export interface Proveedor extends BaseEntity {
  name: string;

  phone?: string;

  email?: string;

  notes?: string;
}


// ======================================
// PEDIDOS
// ======================================

export interface Pedido extends BaseEntity {
  obraId: string;

  proveedorId: string;

  status: PedidoStatus;

  dueDate?: string;

  message: string;

  createdByWorkerId?: string;

  // si vino del bot
  createdFromWhatsapp?: boolean;
}


// ======================================
// ITEMS DE PEDIDO
// ======================================

export interface PedidoItem extends BaseEntity {
  pedidoId: string;

  materialId: string;

  quantity: number;

  unitPrice?: number;

  subtotal?: number;
}


// ======================================
// ALERTAS
// ======================================

export interface Alert extends BaseEntity {
  obraId?: string;

  type: AlertType;

  category: AlertCategory;

  message: string;

  read: boolean;
}


// ======================================
// ACTIVIDAD
// ======================================

export interface Activity extends BaseEntity {
  obraId?: string;

  workerId?: string;

  entity: ActivityEntity;

  entityId: string;

  action: string;

  shortMessage: string;

  metadata?: Record<string, any>;
}


// ======================================
// DASHBOARD
// ======================================

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

