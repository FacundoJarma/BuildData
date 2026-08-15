import { pool } from "../db.js";

/**
 * Resuelve un teléfono a un personas.id.
 * Retorna null si no existe persona con ese teléfono.
 */
export async function resolvePersonaIdByTelefono(telefono) {
  const { rows } = await pool.query(
    `SELECT id FROM personas WHERE telefono = $1`,
    [telefono]
  );
  return rows[0]?.id ?? null;
}

/**
 * Resuelve un nombre de persona a su personas.id (case-insensitive).
 * Retorna null si no existe persona con ese nombre.
 */
export async function resolvePersonaIdByNombre(nombre) {
  const { rows } = await pool.query(
    `SELECT id FROM personas WHERE LOWER(nombre) = LOWER($1)`,
    [nombre]
  );
  return rows[0]?.id ?? null;
}
