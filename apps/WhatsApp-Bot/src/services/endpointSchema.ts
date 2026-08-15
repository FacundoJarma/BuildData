export interface EndpointParam {
  name: string;
  type: "string" | "number" | "array" | "object";
  description: string;
  required: boolean;
  source: "obra_poll" | "user_phone" | "llm" | "auto";
  isName?: boolean;
}

export interface EndpointSchema {
  path: string;
  method: "POST" | "GET";
  description: string;
  params: EndpointParam[];
}

export const ENDPOINTS: EndpointSchema[] = [
  {
    path: "/bot/tareas",
    method: "POST",
    description:
      "Crear una nueva tarea a partir de un mensaje de un obrero (ej: 'hay que pintar la pared del baño')",
    params: [
      {
        name: "obra_id",
        type: "string",
        description: "ID o nombre de la obra",
        required: true,
        source: "obra_poll",
      },
      {
        name: "telefono",
        type: "string",
        description:
          "Teléfono de quien reporta (se usa para resolver creada_por)",
        required: true,
        source: "user_phone",
      },
      {
        name: "titulo",
        type: "string",
        description:
          "Título breve de la tarea (máx 150 caracteres, ej: 'Pintar pared del baño')",
        required: true,
        source: "llm",
      },
      {
        name: "descripcion",
        type: "string",
        description: "Descripción detallada de la tarea",
        required: false,
        source: "llm",
      },
      {
        name: "asignado_a",
        type: "string",
        description: "Nombre de la persona asignada a la tarea",
        required: false,
        source: "llm",
        isName: true,
      },
      {
        name: "rubro_id",
        type: "string",
        description: "Nombre del rubro al que pertenece la tarea",
        required: false,
        source: "llm",
        isName: true,
      },
      {
        name: "prioridad",
        type: "string",
        description: "Prioridad de la tarea: 'baja', 'media' o 'alta'",
        required: false,
        source: "llm",
      },
      {
        name: "fecha_inicio",
        type: "string",
        description: "Fecha de inicio estimada, formato YYYY-MM-DD",
        required: false,
        source: "llm",
      },
      {
        name: "fecha_limite",
        type: "string",
        description: "Fecha límite estimada, formato YYYY-MM-DD",
        required: false,
        source: "llm",
      },
      {
        name: "costo_estimado",
        type: "number",
        description: "Costo estimado de la tarea",
        required: false,
        source: "llm",
      },
    ],
  },
  {
    path: "/bot/stock",
    method: "POST",
    description:
      "Descontar materiales del stock (ej: 'usé 10 bolsas de cemento')",
    params: [
      {
        name: "obra_id",
        type: "string",
        description: "ID o nombre de la obra",
        required: true,
        source: "obra_poll",
      },
      {
        name: "telefono",
        type: "string",
        description: "Teléfono del obrero",
        required: true,
        source: "user_phone",
      },
      {
        name: "movimientos",
        type: "array",
        description:
          "Lista de materiales usados. Cada item: { nombre: string, cantidad: number }",
        required: true,
        source: "llm",
        isName: true,
      },
    ],
  },
  {
    path: "/bot/pedidoDeCompra",
    method: "POST",
    description:
      "Registrar pedido de materiales que faltan (ej: 'necesito 50 bolsas de cal')",
    params: [
      {
        name: "obra_id",
        type: "string",
        description: "ID o nombre de la obra",
        required: true,
        source: "obra_poll",
      },
      {
        name: "telefono",
        type: "string",
        description: "Teléfono del obrero",
        required: true,
        source: "user_phone",
      },
      {
        name: "proveedor",
        type: "string",
        description: "Nombre del proveedor (ej: 'Corralón San Martín')",
        required: true,
        source: "llm",
        isName: true,
      },
      {
        name: "items",
        type: "array",
        description:
          "Materiales a pedir. Cada item: { nombre: string, cantidad: number, precio_unitario?: number }",
        required: true,
        source: "llm",
        isName: true,
      },
    ],
  },
  {
    path: "/bot/retraso",
    method: "POST",
    description:
      "Registrar que una tarea se atrasó (ej: 'se atrasó la entrega de ladrillos')",
    params: [
      {
        name: "obra_id",
        type: "string",
        description: "ID o nombre de la obra",
        required: true,
        source: "obra_poll",
      },
      {
        name: "telefono",
        type: "string",
        description: "Teléfono del obrero",
        required: true,
        source: "user_phone",
      },
      {
        name: "tarea",
        type: "string",
        description: "Nombre de la tarea atrasada (ej: 'Entrega de ladrillos')",
        required: true,
        source: "llm",
        isName: true,
      },
      {
        name: "dias_retraso",
        type: "number",
        description: "Cantidad de días de retraso",
        required: true,
        source: "llm",
      },
    ],
  },
  {
    path: "/bot/mensaje",
    method: "POST",
    description:
      "Guardar un mensaje general en la obra (cuando el mensaje no amerita otro endpoint específico)",
    params: [
      {
        name: "obra_id",
        type: "string",
        description: "ID o nombre de la obra",
        required: true,
        source: "obra_poll",
      },
      {
        name: "telefono",
        type: "string",
        description: "Teléfono del obrero",
        required: true,
        source: "user_phone",
      },
      {
        name: "tipo",
        type: "string",
        description: "tipo de mensaje: 'texto' (siempre texto por ahora)",
        required: true,
        source: "auto",
      },
      {
        name: "contenido",
        type: "string",
        description: "El mensaje tal cual lo escribió el usuario",
        required: true,
        source: "llm",
      },
    ],
  },
];

export function getEndpointSchema(path: string): EndpointSchema | undefined {
  return ENDPOINTS.find((e) => e.path === path);
}

export interface ValidationResult {
  valid: boolean;
  missingRequired: string[];
}

export function validateApiCall(
  endpoint: string,
  data: Record<string, unknown>,
): ValidationResult {
  const schema = getEndpointSchema(endpoint);
  if (!schema) {
    return {
      valid: false,
      missingRequired: [`endpoint "${endpoint}" no existe`],
    };
  }

  const missing = schema.params
    .filter((p) => p.required && p.source === "llm")
    .filter((p) => data[p.name] === undefined || data[p.name] === null)
    .map((p) => p.name);

  return {
    valid: missing.length === 0,
    missingRequired: missing,
  };
}

export function buildEndpointDescription(): string {
  return ENDPOINTS.map((ep) => {
    const requiredFields = ep.params
      .filter((p) => p.required && p.source === "llm")
      .map((p) => `${p.name} (${p.description})`)
      .join(", ");
    const optionalFields = ep.params
      .filter((p) => !p.required)
      .map((p) => `${p.name} (${p.description})`)
      .join(", ");

    let desc = `  - ${ep.method} ${ep.path}: ${ep.description}`;
    if (requiredFields) desc += `\n    Requerido: ${requiredFields}`;
    if (optionalFields) desc += `\n    Opcional: ${optionalFields}`;
    return desc;
  }).join("\n\n");
}
