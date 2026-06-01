import { pool } from "../db.js";

// GET /gastos/:obra_id
export async function getGastos(req, res) {
  const { obra_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM gastos WHERE obra_id = $1 ORDER BY fecha DESC`,
      [obra_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// POST /gastos
export async function crearGasto(req, res) {
  const { obra_id, categoria, descripcion, monto, pedido_id } = req.body;
  if (!obra_id || !monto) return res.status(400).json({ error: "obra_id y monto son requeridos" });
  try {
    const result = await pool.query(
      `INSERT INTO gastos (obra_id, usuario_id, categoria, descripcion, monto, pedido_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [obra_id, req.user.id, categoria, descripcion, monto, pedido_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}