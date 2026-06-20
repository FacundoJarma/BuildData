import { supabase } from "@/lib/supabaseClient";
import type { ApiDashboardResponse } from "@/types/dashboard.api";
import type { DashboardData, TaskItem, OrderItem } from "@/types/dashboard";

const TRADE_COLORS: Record<string, string> = {
  "Mampostería":                "#22C55E",
  "Hormigón armado":            "#0F4395",
  "Instalaciones eléctricas":   "#3B82F6",
  "Instalaciones sanitarias":   "#3B82F6",
  "Terminaciones":              "#F59E0B",
  "Carpintería":                "#94A3B8",
};
const TRADE_COLOR_FALLBACK = "#64748B";

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1)   return "ahora";
  if (minutes < 60)  return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)    return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1)    return "ayer";
  return `hace ${days} días`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "hoy";
  if (days === 1) return "ayer";
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
}

// ─── Transformación API → UI ──────────────────────────────────────────────────

function transformDashboard(api: ApiDashboardResponse): DashboardData {
  return {
    obra: {
      name:       api.obra.name,
      lastUpdate: formatRelativeTime(api.obra.lastUpdate),
    },

    stats: {
      avanceTotal:       api.stats.avanceTotal,
      avanceDelta:       `+${api.stats.avanceDeltaPct}% esta semana`,
      alertasCriticas:   api.stats.alertasCriticas,
      alertasDelta:      `+${api.stats.alertasDeltaHoy} hoy`,
      pedidos:           api.stats.pedidos,
      pedidosPendientes: api.stats.pedidosPendientes,
      tareasCompletadas: api.stats.tareasCompletadas,
      tareasTotal:       api.stats.tareasTotal,
    },

    budget: {
      total:           api.budget.total,
      ejecutado:       api.budget.ejecutado,
      disponible:      api.budget.disponible,
      ejecutadoPct:    api.budget.ejecutadoPct,
      comprometidoPct: api.budget.comprometidoPct,
      librePct:        api.budget.librePct,
      updatedAt:       formatDate(api.budget.updatedAt),
    },

    budgetBreakdown: api.budgetBreakdown.map((item) => {
      const over = item.spent > item.cap;
      return {
        name:    item.name,
        spent:   item.spent,
        cap:     item.cap,
        over,
        overPct: over
          ? Math.round(((item.spent - item.cap) / item.cap) * 100)
          : undefined,
      };
    }),

    tradeProgress: api.tradeProgress.map((item) => ({
      name:  item.name,
      pct:   item.pct,
      color: TRADE_COLORS[item.name] ?? TRADE_COLOR_FALLBACK,
    })),

    activityFeed: api.activityFeed.map((item) => ({
      initials: item.initials,
      name:     item.name,
      action:   item.action,
      time:     formatTime(item.timestamp),
    })),

    alerts: api.alerts.map((item) => ({
      id:       item.id,
      title:    item.title,
      subtitle: item.subtitle,
      time:     formatRelativeTime(item.timestamp),
      tone:     item.severity,
    })),

    tasks: api.tasks.map((task): TaskItem => ({
      id:             task.id,
      title:          task.titulo,
      status:         task.estado,
      priority:       task.prioridad,
      progressPercent: task.porcentaje_avance,
      startDate:      task.fecha_inicio ? formatDate(task.fecha_inicio) : "",
      dueDate:        task.fecha_limite ? formatDate(task.fecha_limite) : "",
    })),

    orders: api.orders.map((order): OrderItem => ({
      id:         order.id,
      status:     order.estado,
      approved:   order.aprobado,
      date:       formatDate(order.fecha),
      supplierId: order.proveedor_id,
      items:      order.items.map((item) => ({
        materialId: item.material_id,
        quantity:   item.cantidad,
        unitPrice:  item.precio_unitario,
      })),
    })),
  };
}

// ─── Export público ───────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getDashboard(obraId: string): Promise<DashboardData> {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(`${API_URL}/dashboard/${obraId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token || ""}`,
    },
  });

  if (!res.ok) throw new Error(`Dashboard fetch failed: ${res.status}`);

  const data: ApiDashboardResponse = await res.json();
  return transformDashboard(data);
}