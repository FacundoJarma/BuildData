import { pool } from "../db.js";

// GET /tareas/:obra_id — todas las tareas de una obra con sus subtareas
export async function getTareas(req, res) {
  const { obra_id } = req.params;
  try {
    const tareas = await pool.query(
      `SELECT t.*, u.nombre as asignado_nombre
       FROM tareas t
       LEFT JOIN personas u ON t.asignado_a = u.id
       WHERE t.obra_id = $1
       ORDER BY t.fecha_inicio ASC`,
      [obra_id]
    );

    // Para cada tarea, traer sus subtareas
    const tareasConSubtareas = await Promise.all(
      tareas.rows.map(async (tarea) => {
        const subtareas = await pool.query(
          `SELECT s.*, u.nombre as usuario_nombre
           FROM subtareas s
           LEFT JOIN personas u ON s.usuario_id = u.id
           WHERE s.tarea_id = $1
           ORDER BY s.fecha ASC`,
          [tarea.id]
        );
        return { ...tarea, subtareas: subtareas.rows };
      })
    );

    res.json(tareasConSubtareas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo tareas" });
  }
}

// POST /tareas — crear tarea nueva
export async function crearTarea(req, res) {
  const { obra_id, titulo, descripcion, estado, prioridad, fecha_inicio, fecha_limite, asignado_a } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tareas (obra_id, titulo, descripcion, estado, prioridad, fecha_inicio, fecha_limite, asignado_a)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [obra_id, titulo, descripcion, estado || "pendiente", prioridad, fecha_inicio, fecha_limite, asignado_a]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando tarea" });
  }
}

// PATCH /tareas/:id — actualizar estado o progreso
export async function actualizarTarea(req, res) {
  const { id } = req.params;
  const { estado, porcentaje_avance, asignado_a, fecha_limite } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tareas
SET estado = COALESCE($1, estado),
    porcentaje_avance = COALESCE($2, porcentaje_avance),
    asignado_a = COALESCE($3, asignado_a),
    fecha_limite = COALESCE($4, fecha_limite),
    fecha_completada = CASE
      WHEN $1 = 'completada'
      THEN CURRENT_TIMESTAMP
      ELSE fecha_completada
    END
    WHERE id = $5
    RETURNING *`,
      [estado, porcentaje_avance, asignado_a, fecha_limite, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando tarea" });
  }
}

// POST /tareas/:tarea_id/subtareas — crear subtarea manualmente
export async function crearSubtarea(req, res) {
  const { tarea_id } = req.params;
  const { usuario_id, titulo, descripcion, created_by } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO subtareas (tarea_id, usuario_id, titulo, descripcion, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tarea_id, usuario_id, titulo, descripcion, created_by]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando subtarea" });
  }
}