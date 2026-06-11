import type { Obra, FileItem } from "@/types/projects";
import { supabase } from "@/lib/supabaseClient";

export interface CreateObraInput {
  tipo: string;
  plantilla: string;
  nombre: string;
  codigo: string;
  direccion: string;
  inicio: string;
  fin: string;
  team: { name: string; phone: string; role: string }[];
  waConnect: boolean;
}

interface CreateObraPayload {
  name: string;
  code: string;
  type: string;
  address: string;
  city: string;
  province: string;
  zip?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  myRole: string;
  team?: string[];
  presupuestoTotal: number;
  rubros: { nombre: string; presupuesto?: number }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getObras(): Promise<Obra[]> {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(`${API_URL}/obras/obras`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token || ""}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener obras");

  const json = await res.json();

  return (json.obras || []).map((o: any) => ({
    id: String(o.id),
    name: o.name,
    code: o.code,
    address: o.address,
    type: o.type,
    status: o.status,
    progress: 50,
    alerts: o.alerts ?? 0,
    pedidos: o.pedidos ?? 0,
    team: (o.team || []).map((t: any) => t.initials),
    lastActivity: o.lastActivity || "",
    lastActivityWho: o.lastActivityWho || "",
    starred: o.starred || false,
    color: "#0F4395",
  }));
}

export async function getFiles(): Promise<FileItem[]> {
  // TODO: Reemplazar con llamada real a la API
  return [
    { name: "Cronograma_Belgrano_v3.xlsx", kind: "xlsx", obra: "Edificio Belgrano", when: "hace 2 h", size: "1.2 MB" },
    { name: "Plano Sector C - planta 4.pdf", kind: "pdf", obra: "Edificio Belgrano", when: "ayer", size: "4.8 MB" },
    { name: "IMG_2034.jpg", kind: "img", obra: "Torre Palermo Norte", when: "hoy 10:15", size: "2.1 MB" },
    { name: "Pedido_PED-0142.pdf", kind: "pdf", obra: "Edificio Belgrano", when: "ayer 17:30", size: "180 KB" },
    { name: "Memoria descriptiva.docx", kind: "doc", obra: "Casa Villa Urquiza", when: "12 May", size: "420 KB" },
    { name: "Reporte_semanal_S20.pdf", kind: "pdf", obra: "Oficinas Pilar", when: "11 May", size: "900 KB" },
  ];
}

export async function createObra(input: CreateObraInput): Promise<any> {
  const { data: { session } } = await supabase.auth.getSession();

  const payload: CreateObraPayload = {
    name: input.nombre,
    code: input.codigo,
    type: input.tipo,
    address: input.direccion,
    startDate: input.inicio || undefined,
    endDate: input.fin || undefined,
    city: "CABA",
    province: "CABA",
    myRole: "director",
    presupuestoTotal: 1_000_000,
    rubros: [{ nombre: "Rubro general", presupuesto: 50_000 },
      { nombre: "Rubro secundario", presupuesto: 950_000 }
    ],
    team: [],
  };

  const res = await fetch(`${API_URL}/obras/obras`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token || ""}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al crear obra");
  }

  return res.json();
}