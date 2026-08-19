import { supabase } from "@/lib/supabaseClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function createTask(obraId: string, data: Record<string, string>) {
  const { data: { session } } = await supabase.auth.getSession();

  const payload = {
    obra_id: obraId,
    titulo: data.nombre,
    descripcion: data.desc || "",
    rubro_id: data.rubro_id || null,
  };

  const res = await fetch(`${API_URL}/tareas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token || ""}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al crear tarea");
  }

  return res.json();
}
