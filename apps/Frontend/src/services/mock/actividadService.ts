import { ACTIVITY_GROUPS } from "@/app/[obraId]/dashboard/actividad/data";
import type { ActivityGroup } from "@/app/[obraId]/dashboard/actividad/data";

export interface ActividadData {
  groups: ActivityGroup[];
}

export async function getActividad(): Promise<ActividadData> {
  await new Promise((r) => setTimeout(r, 250));
  return { groups: JSON.parse(JSON.stringify(ACTIVITY_GROUPS)) };
}
