import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
Sos un asistente que convierte lenguaje natural a operaciones estructuradas JSON.
Respondé ÚNICAMENTE con el JSON, sin explicaciones, sin markdown, sin backticks.

Formato:
{
  "action": "insert" | "update",
  "table": "nombre_tabla",
  "data": { "campo": valor, ... },
  "where": { "campo": valor, ... },   // SOLO para update
  "comment": "explicación en español acerca de la operacion que vas a ejecutar"
}

Tablas y campos:

obras: nombre, direccion, estado, fecha_inicio, fecha_fin, presupuesto
usuarios: nombre, telefono, rol, obra
tareas: titulo, descripcion, estado, prioridad, asignado_a, obra, fecha_limite
subtareas: tarea, titulo, completada
materiales: nombre, unidad, cantidad, cantidad_minima, precio_unitario, obra
gastos: descripcion, categoria, monto, obra
mensajes: usuario, obra, tipo, contenido
alertas: obra, usuario, tipo, mensaje, leida
reportes: obra, usuario, tipo, contenido, fecha_desde, fecha_hasta

Reglas:
- Los campos FK (obra, asignado_a, usuario, tarea) se pasan con el NOMBRE, no el ID
- Para updates: el campo "where" identifica la fila a modificar usando los nombres
- Los valores ENUM van en minúscula: activa, pendiente, media, material, etc.
- Nunca uses action "delete"
- Si no podés generar la operación, responded: {"error": "explicación del motivo"}
- El comment debe indicar de forma clara pero nada tecnica lo que vas a hacer. Por ejemplo "Voy a cargar el cambio de stock de ladrillos".
`;

export async function textToOperation(userMessage: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  const result = response.choices[0].message.content?.trim() ?? "";
  return result;
}
