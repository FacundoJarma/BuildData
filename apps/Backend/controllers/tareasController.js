import { pool } from "../db.js";
import { resolvePersonaIdByTelefono } from "../services/personaService.js";

const ESTADOS_VALIDOS = ["pendiente", "en_progreso", "completada", "cancelada"];
const PRIORIDADES_VALIDAS = ["baja", "media", "alta", "urgente"];

// Resuelve el id de miembros_obra para una persona dentro de una obra específica.
// asignado_a y completada_por en `tareas` ahora referencian miembros_obra(id),
// no personas(id) directamente — esto centraliza esa resolución.
async function resolveMiembroObraId(personaId, obraId) {
  if (!personaId || !obraId) return null;
  const { rows } = await pool.query(
    `SELECT id FROM miembros_obra WHERE persona_id = $1 AND obra_id = $2`,
    [personaId, obraId]
  );
  return rows[0]?.id ?? null;
}

// GET /tareas/:obra_id — reportes granulares de una obra
export async function getTareas(req, res) {
  const { obra_id } = req.params;
  try {
    const tareas = await pool.query(
      `SELECT t.*,
              p.nombre AS usuario_nombre,
              r.nombre AS rubro_nombre,
              pa.nombre AS asignado_a_nombre,
              pc.nombre AS completada_por_nombre
       FROM tareas t
       LEFT JOIN personas p ON t.usuario_id = p.id
       LEFT JOIN rubros r ON t.rubro_id = r.id
       LEFT JOIN miembros_obra moa ON t.asignado_a = moa.id
       LEFT JOIN personas pa ON moa.persona_id = pa.id
       LEFT JOIN miembros_obra moc ON t.completada_por = moc.id
       LEFT JOIN personas pc ON moc.persona_id = pc.id
       WHERE t.obra_id = $1
       ORDER BY t.created_at DESC`,
      [obra_id]
    );
    res.json(tareas.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo tareas" });
  }
}

// Valida rubro_id (existe) y resuelve asignado_a de persona_id -> miembro_obra_id.
// Devuelve { error } o { miembroObraId }.
async function validarYResolverReferencias({ rubro_id, asignado_a, obra_id }) {
  if (rubro_id) {
    const rubro = await pool.query(`SELECT id FROM rubros WHERE id = $1`, [rubro_id]);
    if (rubro.rows.length === 0) return { error: "rubro_id no encontrado" };
  }

  let miembroObraId = null;
  if (asignado_a) {
    miembroObraId = await resolveMiembroObraId(asignado_a, obra_id);
    if (!miembroObraId) {
      return { error: "asignado_a no es miembro de esta obra" };
    }
  }

  return { miembroObraId };
}

// POST /tareas — crear reporte granular (usado por QuickAddModal)
export async function crearTarea(req, res) {
  const {
    obra_id,
    titulo,
    descripcion,
    rubro_id,
    prioridad,
    fecha_inicio,
    fecha_limite,
    asignado_a, // persona_id — se resuelve a miembro_obra_id internamente
    costo_estimado,
  } = req.body;

  if (!obra_id || !titulo || !titulo.trim()) {
    return res.status(400).json({ error: "obra_id y titulo son requeridos" });
  }
  if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad)) {
    return res.status(400).json({ error: `prioridad inválida. Usar: ${PRIORIDADES_VALIDAS.join(", ")}` });
  }

  try {
    const { error: errorRef, miembroObraId } = await validarYResolverReferencias({
      rubro_id,
      asignado_a,
      obra_id,
    });
    if (errorRef) return res.status(404).json({ error: errorRef });

    const personaId = req.personaId || null;
    const result = await pool.query(
      `INSERT INTO tareas
         (obra_id, titulo, descripcion, rubro_id, usuario_id, created_by,
          prioridad, fecha_inicio, fecha_limite, asignado_a, costo_estimado)
       VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        obra_id,
        titulo,
        descripcion || null,
        rubro_id || null,
        personaId,
        prioridad || null,
        fecha_inicio || null,
        fecha_limite || null,
        miembroObraId,
        costo_estimado || null,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando tarea" });
  }
}

// POST /bot/tareas — el bot crea un reporte a partir de un mensaje de un obrero.
// obra_id llega resuelto por el poll de obra; rubro_id y asignado_a ya llegan
// resueltos por el pipeline de entidades (pgvector + pg_trgm) como persona_id —
// acá NO se resuelve texto libre, solo se validan/resuelven las UUIDs recibidas.
export async function crearTareaDesdeBot(req, res) {
  const {
    obra_id,
    titulo,
    descripcion,
    rubro_id,
    creada_por,
    creada_por_telefono,
    prioridad,
    fecha_limite,
    asignado_a, // persona_id
  } = req.body;

  if (!obra_id || !titulo || !titulo.trim()) {
    return res.status(400).json({ error: "obra_id y titulo son requeridos" });
  }
  if (titulo.length > 150) {
    return res.status(400).json({ error: "titulo no puede superar los 150 caracteres" });
  }
  if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad)) {
    return res.status(400).json({ error: `prioridad inválida. Usar: ${PRIORIDADES_VALIDAS.join(", ")}` });
  }

  try {
    const obra = await pool.query(`SELECT id FROM obras WHERE id = $1`, [obra_id]);
    if (obra.rows.length === 0) {
      return res.status(404).json({ error: "obra_id no encontrada" });
    }

    const { error: errorRef, miembroObraId } = await validarYResolverReferencias({
      rubro_id,
      asignado_a,
      obra_id,
    });
    if (errorRef) return res.status(404).json({ error: errorRef });

    // El bot siempre manda teléfono (nunca uuid) para creada_por.
    // created_by/usuario_id se quedan a nivel personas (Opción A).
    let usuarioId = creada_por || null;
    if (!usuarioId && creada_por_telefono) {
      usuarioId = await resolvePersonaIdByTelefono(creada_por_telefono);
      if (!usuarioId) {
        return res.status(404).json({ error: "creada_por_telefono no resuelve a ningún obrero" });
      }
    }

    const result = await pool.query(
      `INSERT INTO tareas
         (obra_id, titulo, descripcion, rubro_id, usuario_id, created_by,
          prioridad, fecha_limite, asignado_a)
       VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8)
       RETURNING *`,
      [
        obra_id,
        titulo,
        descripcion || null,
        rubro_id || null,
        usuarioId,
        prioridad || null,
        fecha_limite || null,
        miembroObraId,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando tarea desde bot" });
  }
}

// PATCH /tareas/:id — corregir/actualizar campos de una tarea.
// No maneja completar la tarea (ver completarTarea) para no permitir
// que el cliente falsifique completada_por / fecha_completada.
export async function actualizarTarea(req, res) {
  const { id } = req.params;
  const {
    titulo,
    descripcion,
    rubro_id,
    estado,
    prioridad,
    fecha_inicio,
    fecha_limite,
    asignado_a, // persona_id
    costo_estimado,
  } = req.body;

  if (estado && !ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({ error: `estado inválido. Usar: ${ESTADOS_VALIDOS.join(", ")}` });
  }
  if (estado === "completada") {
    return res.status(400).json({
      error: "Para completar una tarea usá POST /tareas/:id/completar",
    });
  }
  if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad)) {
    return res.status(400).json({ error: `prioridad inválida. Usar: ${PRIORIDADES_VALIDAS.join(", ")}` });
  }

  try {
    // Necesitamos obra_id de la tarea para resolver asignado_a -> miembro_obra_id
    const tareaActual = await pool.query(`SELECT obra_id FROM tareas WHERE id = $1`, [id]);
    if (tareaActual.rows.length === 0) {
      return res.status(404).json({ error: "tarea no encontrada" });
    }
    const obraId = tareaActual.rows[0].obra_id;

    const { error: errorRef, miembroObraId } = await validarYResolverReferencias({
      rubro_id,
      asignado_a,
      obra_id: obraId,
    });
    if (errorRef) return res.status(404).json({ error: errorRef });

    const result = await pool.query(
      `UPDATE tareas
       SET titulo = COALESCE($1, titulo),
           descripcion = COALESCE($2, descripcion),
           rubro_id = COALESCE($3, rubro_id),
           estado = COALESCE($4, estado),
           prioridad = COALESCE($5, prioridad),
           fecha_inicio = COALESCE($6, fecha_inicio),
           fecha_limite = COALESCE($7, fecha_limite),
           asignado_a = COALESCE($8, asignado_a),
           costo_estimado = COALESCE($9, costo_estimado)
       WHERE id = $10
       RETURNING *`,
      [
        titulo,
        descripcion,
        rubro_id,
        estado,
        prioridad,
        fecha_inicio,
        fecha_limite,
        miembroObraId,
        costo_estimado,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando tarea" });
  }
}

// POST /tareas/:id/completar — completar desde la web.
// completada_por sale del usuario autenticado (req.personaId), nunca del body,
// y se resuelve a miembro_obra_id contra la obra de la tarea.
export async function completarTarea(req, res) {
  const { id } = req.params;
  const personaId = req.personaId;

  if (!personaId) {
    return res.status(401).json({ error: "No se pudo identificar al usuario que completa la tarea" });
  }

  try {
    const tarea = await pool.query(`SELECT obra_id FROM tareas WHERE id = $1`, [id]);
    if (tarea.rows.length === 0) {
      return res.status(404).json({ error: "tarea no encontrada" });
    }

    const miembroObraId = await resolveMiembroObraId(personaId, tarea.rows[0].obra_id);
    if (!miembroObraId) {
      return res.status(403).json({ error: "El usuario no es miembro de la obra de esta tarea" });
    }

    const result = await pool.query(
      `UPDATE tareas
       SET estado = 'completada',
           completada_por = $1,
           fecha_completada = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [miembroObraId, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error completando tarea" });
  }
}

// POST /bot/tareas/:id/completar — completar desde el bot de WhatsApp.
// Recibe teléfono (nunca uuid), se resuelve a persona y luego a miembro_obra
// contra la obra de la tarea puntual.
export async function completarTareaDesdeBot(req, res) {
  const { id } = req.params;
  const { telefono } = req.body;

  if (!telefono) {
    return res.status(400).json({ error: "telefono es requerido" });
  }

  try {
    const tarea = await pool.query(`SELECT obra_id FROM tareas WHERE id = $1`, [id]);
    if (tarea.rows.length === 0) {
      return res.status(404).json({ error: "tarea no encontrada" });
    }

    const personaId = await resolvePersonaIdByTelefono(telefono);
    if (!personaId) {
      return res.status(404).json({ error: "telefono no resuelve a ningún obrero" });
    }

    const miembroObraId = await resolveMiembroObraId(personaId, tarea.rows[0].obra_id);
    if (!miembroObraId) {
      return res.status(403).json({ error: "El obrero no es miembro de la obra de esta tarea" });
    }

    const result = await pool.query(
      `UPDATE tareas
       SET estado = 'completada',
           completada_por = $1,
           fecha_completada = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [miembroObraId, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error completando tarea desde bot" });
  }
}