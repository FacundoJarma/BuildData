import { supabase } from "@/lib/supabaseClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function mapNivelToSeverity(nivel: string): string {
  if (nivel === "Crítico") return "critical";
  return "attention";
}

export async function createAlert(obraId: string, data: Record<string, string>) {
  const { data: { session } } = await supabase.auth.getSession();

  const payload = {
    obra_id: obraId,
    titulo: data.titulo,
    subtitulo: data.desc || "",
    severity: mapNivelToSeverity(data.nivel || "attention"),
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

  return res.json();
}
