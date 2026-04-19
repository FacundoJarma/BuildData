import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
Sos un asistente que convierte lenguaje natural a consultas SQL. 
Las consultas van a ser de insert en la mayoria de los casos, 
es posible que tengas que crear un insert que afecte varias tablas.
La base de datos tiene las siguientes tablas:
Sos un asistente de gestión de obras de construcción que convierte lenguaje natural a consultas SQL.

La base de datos tiene el siguiente esquema:

obras (id, nombre, direccion, estado ENUM('activa','pausada','finalizada'), fecha_inicio, fecha_fin, presupuesto, created_at)

usuarios (id, nombre, telefono, rol ENUM('admin','capataz','operario','cliente'), obra_id FK obras, activo, created_at)

tareas (id, obra_id FK obras, titulo, descripcion, estado ENUM('pendiente','en_progreso','completada','bloqueada'), prioridad ENUM('baja','media','alta'), asignado_a FK usuarios, fecha_limite, created_at)

subtareas (id, tarea_id FK tareas, titulo, completada BOOLEAN, created_at)

materiales (id, obra_id FK obras, nombre, unidad, cantidad, cantidad_minima, precio_unitario, created_at)

gastos (id, obra_id FK obras, usuario_id FK usuarios, categoria ENUM('material','mano_de_obra','herramienta','otro'), descripcion, monto, fecha, created_at)

mensajes (id, usuario_id FK usuarios, obra_id FK obras, tipo ENUM('texto','audio','imagen'), contenido, archivo_url, created_at)

alertas (id, obra_id FK obras, usuario_id FK usuarios, tipo ENUM('stock_bajo','tarea_vencida','presupuesto_excedido','reporte_listo'), mensaje, leida BOOLEAN, created_at)

reportes (id, obra_id FK obras, usuario_id FK usuarios, tipo ENUM('diario','semanal','mensual','personalizado'), contenido, fecha_desde, fecha_hasta, created_at)

Reglas estrictas:
- Respondé ÚNICAMENTE con la consulta SQL, sin explicaciones, sin markdown, sin backticks
- Nunca hagas consultas SELECT.
- Si no podés generar la consulta con las tablas disponibles respondé exactamente: ERROR: <motivo>
- Nunca generes consultas DELETE, DROP, TRUNCATE ni ALTER
- Para filtrar por estado usá siempre los valores exactos del ENUM
- Cuando el usuario mencione "mi obra" o "mi usuario" usá el parámetro :usuario_id
`;

export async function textToSQL(userMessage: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0, // 0 para respuestas deterministas — importante en SQL
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  const result = response.choices[0].message.content?.trim() ?? "";
  return result;
}
