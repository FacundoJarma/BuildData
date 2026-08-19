import { pool } from "../db.js";
import { resolvePersonaIdByTelefono } from "../services/personaService.js";

function formatRubro(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    estado: row.estado,
    prioridad: row.prioridad,
    fecha_inicio: row.fecha_inicio,
    fecha_limite: row.fecha_limite,
    porcentaje_avance: row.porcentaje_avance,
    costo_estimado: row.costo_estimado,
    asignado_a: row.asignado_a,
    creada_por: row.creada_por,
    completada_por: row.completada_por,
    fecha_completada: row.fecha_completada,
    cap: parseInt(row.cap) || 0,
    spent: parseInt(row.spent) || 0,
    progress: parseInt(row.progress) || 0,
  };
}

// GET /obras/:obraId/rubros
export async function getRubros(req, res) {
  const { obraId } = req.params;
  try {
    const result = await pool.query(
      `SELECT r.*, pr.cap, pr.spent,
        CASE WHEN pr.cap > 0 THEN ROUND((pr.spent::numeric / pr.cap) * 100) ELSE 0 END AS progress
       FROM rubros r
       LEFT JOIN presupuesto_rubros pr ON pr.rubro_id = r.id
       WHERE r.obra_id = $1 ORDER BY r.orden ASC, r.nombre ASC`,
      [obraId]
    );
    res.json({ rubros: result.rows.map(formatRubro) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: "SERVER_ERROR", message: error.message });
  }
}

// POST /obras/:obraId/rubros
export async function crearRubro(req, res) {
  const { obraId } = req.params;
  const {
    nombre,
    presupuesto,
    descripcion,
    estado,
    prioridad,
    fecha_inicio,
    fecha_limite,
    costo_estimado,
    asignado_a,
    creada_por,
  } = req.body;
  if (!nombre || presupuesto === undefined) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "nombre y presupuesto son requeridos" });
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const rubro = await client.query(
      `INSERT INTO rubros
        (obra_id, nombre, descripcion, estado, prioridad, fecha_inicio, fecha_limite, costo_estimado, asignado_a, creada_por)
       VALUES ($1,$2,$3,COALESCE($4,'pendiente'),$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [obraId, nombre, descripcion || null, estado || null, prioridad || null, fecha_inicio || null, fecha_limite || null, costo_estimado || null, asignado_a || null, creada_por || null]
    );
    await client.query(
      `INSERT INTO presupuesto_rubros (rubro_id, cap) VALUES ($1,$2)`,
      [rubro.rows[0].id, presupuesto]
    );
    await client.query("COMMIT");
    res.status(201).json(formatRubro({ ...rubro.rows[0], cap: presupuesto, spent: 0, progress: 0 }));
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ code: "SERVER_ERROR", message: error.message });
  } finally { client.release(); }
}

// PATCH /obras/:obraId/rubros/:rubroId
export async function updateRubro(req, res) {
  const { rubroId, obraId } = req.params;
  const {
    cap,
    spent,
    nombre,
    descripcion,
    estado,
    prioridad,
    fecha_inicio,
    fecha_limite,
    porcentaje_avance,
    costo_estimado,
    asignado_a,
    completada_por,
  } = req.body;
  try {
    await pool.query(
      `UPDATE rubros SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        estado = COALESCE($3, estado),
        prioridad = COALESCE($4, prioridad),
        fecha_inicio = COALESCE($5, fecha_inicio),
        fecha_limite = COALESCE($6, fecha_limite),
        porcentaje_avance = COALESCE($7, porcentaje_avance),
        costo_estimado = COALESCE($8, costo_estimado),
        asignado_a = COALESCE($9, asignado_a),
        completada_por = COALESCE($10, completada_por),
        fecha_completada = CASE
          WHEN $3 = 'completada' THEN CURRENT_TIMESTAMP
          ELSE fecha_completada
        END,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $11`,
      [nombre, descripcion, estado, prioridad, fecha_inicio, fecha_limite, porcentaje_avance, costo_estimado, asignado_a, completada_por, rubroId]
    );

    if (cap !== undefined || spent !== undefined) {
      await pool.query(
        `UPDATE presupuesto_rubros SET
          cap = COALESCE($1, cap),
          spent = COALESCE($2, spent),
          updated_at = NOW()
         WHERE rubro_id = $3`,
        [cap, spent, rubroId]
      );
      // Recalcular ejecutado total
      await pool.query(
        `UPDATE presupuestos SET
          ejecutado = (SELECT COALESCE(SUM(pr.spent),0) FROM presupuesto_rubros pr JOIN rubros r ON r.id = pr.rubro_id WHERE r.obra_id = $1),
          updated_at = NOW()
         WHERE obra_id = $1`, [obraId]
      );
    }

    const result = await pool.query(
      `SELECT r.*, pr.cap, pr.spent,
        CASE WHEN pr.cap > 0 THEN ROUND((pr.spent::numeric / pr.cap)*100) ELSE 0 END AS progress
       FROM rubros r LEFT JOIN presupuesto_rubros pr ON pr.rubro_id = r.id
       WHERE r.id = $1`, [rubroId]
    );
    res.json(formatRubro(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: "SERVER_ERROR", message: error.message });
  }
}

// PATCH /bot/tareas/:id/completar
// El bot detectó que un obrero terminó (o deshizo) un trabajo (ej: "terminé de pintar la pared").
// El id ya viene resuelto por el pipeline de resolución de entidades (match_tareas con pgvector +
// pg_trgm) — acá NO se resuelve texto libre. Sigue llamándose "tarea" de cara al bot (igual que
// tarea_id en /bot/retraso) aunque el campo completado/estado vive en rubros desde la
// reestructuración tareas/rubros.
export async function completarRubroDesdeBot(req, res) {
  const { id } = req.params;
  const { completada, completada_por, completada_por_telefono, porcentaje_avance } = req.body;

  if (typeof completada !== "boolean") {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "completada (boolean) es requerido" });
  }

  try {
    const existing = await pool.query(`SELECT id FROM rubros WHERE id = $1`, [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Tarea no encontrada" });
    }

    if (completada) {
      let completadaPorId = completada_por || null;
      if (!completadaPorId && completada_por_telefono) {
        completadaPorId = await resolvePersonaIdByTelefono(completada_por_telefono);
      }
      if (completadaPorId) {
        const persona = await pool.query(`SELECT id FROM personas WHERE id = $1`, [completadaPorId]);
        if (persona.rows.length === 0) completadaPorId = null;
      }
      if (!completadaPorId) {
        return res.status(422).json({ code: "VALIDATION_ERROR", message: "completada_por es requerido y debe resolver a un obrero válido" });
      }

      const result = await pool.query(
        `UPDATE rubros SET
          estado = 'completada',
          porcentaje_avance = COALESCE($1, 100),
          fecha_completada = CURRENT_TIMESTAMP,
          completada_por = $2,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING id, estado, porcentaje_avance, completada_por, fecha_completada AS completada_en, updated_at`,
        [porcentaje_avance ?? null, completadaPorId, id]
      );
      return res.json(result.rows[0]);
    }

    // Revertir: 'en_curso' si ya había avance, 'pendiente' si no.
    const result = await pool.query(
      `UPDATE rubros SET
        porcentaje_avance = COALESCE($1, porcentaje_avance),
        estado = CASE WHEN COALESCE($1, porcentaje_avance) > 0 THEN 'en_curso' ELSE 'pendiente' END,
        fecha_completada = NULL,
        completada_por = NULL,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, estado, porcentaje_avance, completada_por, fecha_completada AS completada_en, updated_at`,
      [porcentaje_avance ?? null, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: "SERVER_ERROR", message: error.message });
  }
}

// DELETE /obras/:obraId/rubros/:rubroId
export async function deleteRubro(req, res) {
  const { rubroId } = req.params;
  try {
    await pool.query(`DELETE FROM rubros WHERE id = $1`, [rubroId]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: "SERVER_ERROR", message: error.message });
  }
}
