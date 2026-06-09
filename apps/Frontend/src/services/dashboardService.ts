import type { ApiDashboardResponse } from "@/types/dashboard.api";
import type { DashboardData } from "@/types/dashboard";

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
      sector:     api.obra.sector,
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
  };
}

// ─── Mock ─────────────────────────────────────────────────────────────────────
// Refleja exactamente lo que devolverá el backend (tipos ApiDashboardResponse).
// Cuando se conecte la API real, borrar esto y descomentar el fetch de abajo.

const MOCK: ApiDashboardResponse = {
  obra: {
    name:       "Edificio Belgrano",
    sector:     "Sector C",
    lastUpdate: new Date(Date.now() - 12 * 60_000).toISOString(), // hace 12 min
  },
  stats: {
    avanceTotal:       68,
    avanceDeltaPct:    4,
    alertasCriticas:   2,
    alertasDeltaHoy:   1,
    pedidos:           7,
    pedidosPendientes: 3,
    tareasCompletadas: 9,
    tareasTotal:       12,
  },
  budget: {
    total:           124_000_000,
    ejecutado:       81_000_000,
    disponible:      43_000_000,
    ejecutadoPct:    65,
    comprometidoPct: 12,
    librePct:        23,
    updatedAt:       new Date().toISOString(),
  },
  budgetBreakdown: [
    { name: "Hormigón armado", spent: 38_000_000, cap: 52_000_000 },
    { name: "Mampostería",     spent: 21_000_000, cap: 20_000_000 }, // over → lo calcula transform
    { name: "Terminaciones",   spent:  6_000_000, cap: 28_000_000 },
  ],
  tradeProgress: [
    { name: "Mampostería",                pct: 88 },
    { name: "Hormigón armado",            pct: 62 },
    { name: "Instalaciones eléctricas",   pct: 46 },
    { name: "Instalaciones sanitarias",   pct: 58 },
    { name: "Terminaciones",              pct: 24 },
  ],
  activityFeed: [
    {
      initials:  "JM",
      name:      "J. Méndez",
      action:    "Marcó completada Hormigonado losa +3",
      timestamp: new Date(new Date().setHours(8, 42)).toISOString(),
    },
    {
      initials:  "CR",
      name:      "C. Ríos",
      action:    "Subió 4 fotos del Sector C",
      timestamp: new Date(new Date().setHours(10, 15)).toISOString(),
    },
    {
      initials:  "LB",
      name:      "L. Benítez",
      action:    "Pedido de cemento aprobado",
      timestamp: new Date(new Date().setHours(11, 30)).toISOString(),
    },
    {
      initials:  "PS",
      name:      "P. Salas",
      action:    "Reportó falla en Grúa Torre 2",
      timestamp: new Date(new Date().setHours(12, 48)).toISOString(),
    },
  ],
  alerts: [
    {
      id:        "a1",
      title:     "Falla en Grúa Torre 2",
      subtitle:  "Sector C · J. Méndez",
      timestamp: new Date(Date.now() - 12 * 60_000).toISOString(),
      severity:  "critical",
    },
    {
      id:        "a2",
      title:     "Faltante: hierro 12 mm",
      subtitle:  "Pedido sin aprobar",
      timestamp: new Date(Date.now() - 2 * 3_600_000).toISOString(),
      severity:  "critical",
    },
    {
      id:        "a3",
      title:     "Demora en hormigón",
      subtitle:  "Sector B · 3 días",
      timestamp: new Date(Date.now() - 24 * 3_600_000).toISOString(),
      severity:  "attention",
    },
  ],
};

// ─── Export público ───────────────────────────────────────────────────────────

export async function getDashboard(obraId: string): Promise<DashboardData> {
  void obraId;

  // TODO: cuando el backend esté listo, reemplazar las dos líneas de abajo por:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obras/${obraId}/dashboard`);
  // if (!res.ok) throw new Error(`Dashboard fetch failed: ${res.status}`);
  // const data: ApiDashboardResponse = await res.json();
  // return transformDashboard(data);

  return transformDashboard(MOCK);
}