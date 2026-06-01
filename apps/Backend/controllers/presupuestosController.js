import { pool } from "../db.js";

// GET /presupuestos/:obra_id
export async function getPresupuestos(req, res) {
  const { obra_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM presupuestos WHERE obra_id = $1 ORDER BY rubro ASC`,
      [obra_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// POST /presupuestos
export async function crearPresupuesto(req, res) {
  const { obra_id, rubro, monto_estimado } = req.body;
  if (!obra_id || !rubro || !monto_estimado) return res.status(400).json({ error: "obra_id, rubro y monto_estimado son requeridos" });
  try {
    const result = await pool.query(
      `INSERT INTO presupuestos (obra_id, rubro, monto_estimado) VALUES ($1, $2, $3) RETURNING *`,
      [obra_id, rubro, monto_estimado]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// PATCH /presupuestos/:id — actualizar monto ejecutado
export async function actualizarPresupuesto(req, res) {
  const { id } = req.params;
  const { monto_actual } = req.body;
  try {
    const result = await pool.query(
      `UPDATE presupuestos SET monto_actual = $1 WHERE id = $2 RETURNING *`,
      [monto_actual, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}