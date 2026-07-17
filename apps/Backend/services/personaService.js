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
