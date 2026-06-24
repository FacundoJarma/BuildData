import { ALERTS } from "@/app/[obraId]/dashboard/alertas/data";
import type { AlertaItem } from "@/app/[obraId]/dashboard/alertas/data";

export interface AlertasData {
  alerts: AlertaItem[];
}

export async function getAlertas(): Promise<AlertasData> {
  await new Promise((r) => setTimeout(r, 250));
  return { alerts: JSON.parse(JSON.stringify(ALERTS)) };
}
