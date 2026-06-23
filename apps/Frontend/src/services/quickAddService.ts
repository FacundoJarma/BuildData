import { supabase } from "@/lib/supabaseClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function mapNivelToSeverity(nivel: string): string {
  if (nivel === "Crítico") return "critical";
  return "attention";
}

export async function createTask(obraId: string, data: Record<string, string>) {
  const { data: { session } } = await supabase.auth.getSession();

  const payload = {
    obra_id: obraId,
    titulo: data.nombre,
    descripcion: data.desc || "",
    asignado_a: data.who || null,
    prioridad: "media",
    estado: "pendiente",
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

export async function createAlert(obraId: string, data: Record<string, string>) {
  const { data: { session } } = await supabase.auth.getSession();

  console.log("Creating alert with data:", data);

  const payload = {
    obra_id: obraId,
    titulo: data.titulo,
    subtitulo: data.desc || "",
    severity: mapNivelToSeverity(data.nivel || "attention") || "critical",
  };

  const res = await fetch(`${API_URL}/alertas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token || ""}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al crear alerta");
  }
  const alerta = await res.json();
  console.log("Alert created successfully:", alerta);
  return alerta;
}

export async function createReport(obraId: string, data: Record<string, string>) {
  const { data: { session } } = await supabase.auth.getSession();

  const payload = {
    obra_id: obraId,
    tipo: data.tipo || "Avance de tarea",
    texto: data.texto,
  };

  console.log("Creating actividad with payload:", payload);

  const res = await fetch(`${API_URL}/actividad`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token || ""}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al crear actividad");
  }
  const actividad = await res.json();
  console.log("Actividad created successfully:", actividad);
  return actividad;
}
