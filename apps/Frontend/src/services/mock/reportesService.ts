import { SECTION_DEFS, SNAPSHOT } from "@/app/[obraId]/dashboard/reportes/data";
import type { SectionDef } from "@/app/[obraId]/dashboard/reportes/data";

export interface ReportesData {
  sections: SectionDef[];
  snapshot: typeof SNAPSHOT;
}

export async function getReportesData(): Promise<ReportesData> {
  await new Promise((r) => setTimeout(r, 200));
  return { sections: SECTION_DEFS, snapshot: { ...SNAPSHOT } };
}
