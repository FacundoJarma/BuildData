import { pool } from "../db.js";

// GET /dashboard/:obra_id
// Devuelve un resumen completo de la obra: tareas, materiales, gastos, alertas
export async function getDashboard(req, res) {
  const { obra_id } = req.params;

  try {
    // Conteo de tareas por estado
    const tareas = await pool.query(
      `SELECT estado, COUNT(*) as cantidad
       FROM tareas WHERE obra_id = $1
       GROUP BY estado`,
      [obra_id]
    );

    // Gasto total vs presupuesto
    const gastos = await pool.query(
      `SELECT COALESCE(SUM(monto), 0) as gasto_total FROM gastos WHERE obra_id = $1`,
      [obra_id]
    );

    const presupuesto = await pool.query(
      `SELECT COALESCE(SUM(monto_estimado), 0) as presupuesto_total,
              COALESCE(SUM(monto_actual), 0) as ejecutado_total
       FROM presupuestos WHERE obra_id = $1`,
      [obra_id]
    );

    // Materiales con stock bajo el mínimo
    const materialesBajos = await pool.query(
      `SELECT nombre, stock_actual, stock_minimo
       FROM materiales
       WHERE obra_id = $1 AND stock_actual <= stock_minimo`,
      [obra_id]
    );

    // Alertas sin resolver
    const alertas = await pool.query(
      `SELECT COUNT(*) as alertas_activas
       FROM alertas WHERE obra_id = $1 AND resuelta = false`,
      [obra_id]
    );

    // Mensajes sin procesar
    const mensajesPendientes = await pool.query(
      `SELECT COUNT(*) as pendientes
       FROM mensajes WHERE obra_id = $1 AND estado_procesamiento = 'pendiente'`,
      [obra_id]
    );

    res.json({
      tareas: tareas.rows,
      gasto_total: gastos.rows[0].gasto_total,
      presupuesto: presupuesto.rows[0],
      materiales_con_stock_bajo: materialesBajos.rows,
      alertas_activas: alertas.rows[0].alertas_activas,
      mensajes_pendientes: mensajesPendientes.rows[0].pendientes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo dashboard" });
  }
}