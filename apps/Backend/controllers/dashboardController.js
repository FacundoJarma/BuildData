import { pool } from "../db.js";

// GET /obras/:obraId/dashboard
export async function getDashboard(req, res) {
  const { obraId } = req.params;
  try {
    // Info básica de la obra
    const obraResult = await pool.query(
      `SELECT nombre, last_activity FROM obras WHERE id = $1`,
      [obraId]
    );
    const obra = obraResult.rows[0];

    // Stats de tareas
    const tareasResult = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE estado = 'completada') AS completadas,
        COUNT(*) AS total
       FROM tareas WHERE obra_id = $1`,
      [obraId]
    );
    const tareas = tareasResult.rows[0];

    // Stats de alertas
    const alertasResult = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE severity = 'critical' AND resuelta = false) AS criticas,
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE AND resuelta = false) AS hoy
       FROM alertas WHERE obra_id = $1`,
      [obraId]
    );
    const alertasStats = alertasResult.rows[0];

    // Stats de pedidos
    const pedidosResult = await pool.query(
      `SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE aprobado = false) AS pendientes
       FROM pedidos_materiales WHERE obra_id = $1`,
      [obraId]
    );
    const pedidos = pedidosResult.rows[0];

    // Presupuesto
    const presupuestoResult = await pool.query(
      `SELECT total, ejecutado, comprometido, updated_at
       FROM presupuestos WHERE obra_id = $1`,
      [obraId]
    );
    const pres = presupuestoResult.rows[0] || { total: 0, ejecutado: 0, comprometido: 0 };
    const total = pres.total || 1;
    const disponible = pres.total - pres.ejecutado - pres.comprometido;

    // Budget breakdown por rubro
    const rubrosResult = await pool.query(
      `SELECT r.nombre AS name, pr.spent, pr.cap
       FROM rubros r
       JOIN presupuesto_rubros pr ON pr.rubro_id = r.id
       WHERE r.obra_id = $1`,
      [obraId]
    );

    // Trade progress
    const tradeResult = await pool.query(
      `SELECT r.nombre AS name,
        CASE WHEN pr.cap > 0 THEN ROUND((pr.spent::numeric / pr.cap) * 100) ELSE 0 END AS pct
       FROM rubros r
       JOIN presupuesto_rubros pr ON pr.rubro_id = r.id
       WHERE r.obra_id = $1`,
      [obraId]
    );

    // Activity feed
    const actividadResult = await pool.query(
      `SELECT
        UPPER(LEFT(p.nombre, 1) || LEFT(SPLIT_PART(p.nombre, ' ', 2), 1)) AS initials,
        p.nombre AS name,
        a.accion AS action,
        a.created_at AS timestamp
       FROM actividad a
       JOIN perfiles p ON p.id = a.usuario_id
       WHERE a.obra_id = $1
       ORDER BY a.created_at DESC
       LIMIT 10`,
      [obraId]
    );

    // Alertas sin resolver
    const alertasListResult = await pool.query(
      `SELECT id, titulo AS title, subtitulo AS subtitle, created_at AS timestamp, severity
       FROM alertas
       WHERE obra_id = $1 AND resuelta = false
       ORDER BY created_at DESC`,
      [obraId]
    );

    const avanceTotal = tareas.total > 0
      ? Math.round((tareas.completadas / tareas.total) * 100)
      : 0;

    res.json({
      obra: {
        name: obra.nombre,
        lastUpdate: obra.last_activity,
      },
      stats: {
        avanceTotal,
        avanceDeltaPct: 0,
        alertasCriticas: parseInt(alertasStats.criticas),
        alertasDeltaHoy: parseInt(alertasStats.hoy),
        pedidos: parseInt(pedidos.total),
        pedidosPendientes: parseInt(pedidos.pendientes),
        tareasCompletadas: parseInt(tareas.completadas),
        tareasTotal: parseInt(tareas.total),
      },
      budget: {
        total: pres.total,
        ejecutado: pres.ejecutado,
        disponible,
        ejecutadoPct: Math.round((pres.ejecutado / total) * 100),
        comprometidoPct: Math.round((pres.comprometido / total) * 100),
        librePct: Math.round((disponible / total) * 100),
        updatedAt: pres.updated_at,
      },
      budgetBreakdown: rubrosResult.rows,
      tradeProgress: tradeResult.rows.map(r => ({ ...r, pct: parseInt(r.pct) })),
      activityFeed: actividadResult.rows,
      alerts: alertasListResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: "SERVER_ERROR", message: error.message });
  }
}