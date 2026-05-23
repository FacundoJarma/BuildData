export interface TableSchema {
  fields: string[];
  fk: Record<string, { table: string; by: string }>;
  identity: string[];
}


// TODO: AJUSTARLO PARA LA DB REAL. SOLO PRUEBA.

export const TABLE_SCHEMA: Record<string, TableSchema> = {
  obras: {
    fields: ["nombre", "direccion", "estado", "fecha_inicio", "fecha_fin", "presupuesto"],
    fk: {},
    identity: ["nombre"],
  },
  usuarios: {
    fields: ["nombre", "telefono", "rol", "obra"],
    fk: { obra: { table: "obras", by: "nombre" } },
    identity: ["telefono"],
  },
  tareas: {
    fields: ["titulo", "descripcion", "estado", "prioridad", "asignado_a", "obra", "fecha_limite"],
    fk: { obra: { table: "obras", by: "nombre" }, asignado_a: { table: "usuarios", by: "nombre" } },
    identity: ["titulo", "obra"],
  },
  subtareas: {
    fields: ["tarea", "titulo", "completada"],
    fk: { tarea: { table: "tareas", by: "titulo" } },
    identity: ["titulo", "tarea"],
  },
  materiales: {
    fields: ["nombre", "unidad", "cantidad", "cantidad_minima", "precio_unitario", "obra"],
    fk: { obra: { table: "obras", by: "nombre" } },
    identity: ["nombre", "obra"],
  },
  gastos: {
    fields: ["descripcion", "categoria", "monto", "obra"],
    fk: { obra: { table: "obras", by: "nombre" } },
    identity: ["id"],
  },
  alertas: {
    fields: ["obra", "usuario", "tipo", "mensaje", "leida"],
    fk: { obra: { table: "obras", by: "nombre" }, usuario: { table: "usuarios", by: "nombre" } },
    identity: ["id"],
  },
  mensajes: {
    fields: ["usuario", "obra", "tipo", "contenido"],
    fk: { usuario: { table: "usuarios", by: "nombre" }, obra: { table: "obras", by: "nombre" } },
    identity: ["id"],
  },
  reportes: {
    fields: ["obra", "usuario", "tipo", "contenido", "fecha_desde", "fecha_hasta"],
    fk: { obra: { table: "obras", by: "nombre" }, usuario: { table: "usuarios", by: "nombre" } },
    identity: ["id"],
  },
};
