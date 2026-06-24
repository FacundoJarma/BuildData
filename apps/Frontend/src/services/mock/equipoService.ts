import { PEOPLE, OBREROS } from "@/app/[obraId]/dashboard/equipo/data";
import type { Person, Obrero } from "@/app/[obraId]/dashboard/equipo/data";

export interface EquipoData {
  people: Person[];
  obreros: Obrero[];
}

export async function getEquipo(): Promise<EquipoData> {
  await new Promise((r) => setTimeout(r, 200));
  return { people: [...PEOPLE], obreros: [...OBREROS] };
}
