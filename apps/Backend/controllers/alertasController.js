import { pool } from "../db.js";

// GET /alertas/:obra_id — alertas sin resolver
export async function getAlertas(req, res) {
  const { obra_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT a.*, u.nombre as destinatario
       FROM alertas a
       LEFT JOIN usuarios u ON a.usuario_id = u.id
       WHERE a.obra_id = $1 AND a.resuelta = false
       ORDER BY a.created_at DESC`,
      [obra_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo alertas" });
  }
}

// PATCH /alertas/:id/resolver
export async function resolverAlerta(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE alertas SET resuelta = true WHERE id = $1 RETURNING *`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error resolviendo alerta" });
  }
}

// POST /alertas — crear alerta (usado internamente por el sistema)
export async function crearAlerta(req, res) {
  const { obra_id, tipo, mensaje, prioridad, usuario_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO alertas (obra_id, tipo, mensaje, prioridad, usuario_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [obra_id, tipo, mensaje, prioridad, usuario_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando alerta" });
  }
}