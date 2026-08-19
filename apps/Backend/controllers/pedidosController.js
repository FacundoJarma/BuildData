import { pool } from "../db.js";

// PATCH /pedidos/:id/aprobar
export async function aprobarPedido(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE pedidos_materiales
       SET estado = 'aprobado', aprobado = true, fecha_aprobacion = CURRENT_TIMESTAMP, aprobado_por = $1
       WHERE id = $2
       RETURNING *`,
      [req.personaId || null, id]
    );
    if (!result.rows[0]) return res.status(404).json({ code: "NOT_FOUND", message: "Pedido no encontrado" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: "SERVER_ERROR", message: error.message });
  }
}

// PATCH /pedidos/:id/rechazar
export async function rechazarPedido(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE pedidos_materiales
       SET estado = 'rechazado', aprobado = false, fecha_aprobacion = NULL, aprobado_por = NULL
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ code: "NOT_FOUND", message: "Pedido no encontrado" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: "SERVER_ERROR", message: error.message });
  }
}
