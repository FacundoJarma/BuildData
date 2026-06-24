import { INITIAL_GROUPS } from "@/app/[obraId]/dashboard/cronograma/data";

export interface CronogramaData {
  groups: typeof INITIAL_GROUPS;
}

export async function getCronograma(): Promise<CronogramaData> {
  await new Promise((r) => setTimeout(r, 300));
  return { groups: JSON.parse(JSON.stringify(INITIAL_GROUPS)) };
}
