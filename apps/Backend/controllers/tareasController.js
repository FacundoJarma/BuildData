import { pool } from "../db.js";
import { resolvePersonaIdByTelefono } from "./obrerosController.js";

// GET /tareas/:obra_id — reportes granulares de una obra
export async function getTareas(req, res) {
  const { obra_id } = req.params;
  try {
    const tareas = await pool.query(
      `SELECT t.*, p.nombre AS usuario_nombre, r.nombre AS rubro_nombre
       FROM tareas t
       LEFT JOIN personas p ON t.usuario_id = p.id
       LEFT JOIN rubros r ON t.rubro_id = r.id
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

// POST /tareas — crear reporte granular (usado por QuickAddModal)
export async function crearTarea(req, res) {
  const { obra_id, titulo, descripcion, rubro_id } = req.body;

  if (!obra_id || !titulo || !titulo.trim()) {
    return res.status(400).json({ error: "obra_id y titulo son requeridos" });
  }

  try {
    if (rubro_id) {
      const rubro = await pool.query(`SELECT id FROM rubros WHERE id = $1`, [rubro_id]);
      if (rubro.rows.length === 0) {
        return res.status(404).json({ error: "rubro_id no encontrado" });
      }
    }

    const personaId = req.personaId || null;

    const result = await pool.query(
      `INSERT INTO tareas (obra_id, titulo, descripcion, rubro_id, usuario_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $5)
       RETURNING *`,
      [obra_id, titulo, descripcion || null, rubro_id || null, personaId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando tarea" });
  }
}

// POST /bot/tareas — el bot crea un reporte a partir de un mensaje de un obrero
// (ej: "hay que pintar la pared del baño"). obra_id llega resuelto por el poll de obra,
// rubro_id ya llega resuelto por el pipeline de entidades (pgvector + pg_trgm) —
// acá NO se resuelve texto libre, solo se valida que las UUIDs recibidas existan.
export async function crearTareaDesdeBot(req, res) {
  const { obra_id, titulo, descripcion, rubro_id, creada_por, creada_por_telefono } = req.body;

  if (!obra_id || !titulo || !titulo.trim()) {
    return res.status(400).json({ error: "obra_id y titulo son requeridos" });
  }
  if (titulo.length > 150) {
    return res.status(400).json({ error: "titulo no puede superar los 150 caracteres" });
  }

  try {
    const obra = await pool.query(`SELECT id FROM obras WHERE id = $1`, [obra_id]);
    if (obra.rows.length === 0) {
      return res.status(404).json({ error: "obra_id no encontrada" });
    }

    if (rubro_id) {
      const rubro = await pool.query(`SELECT id FROM rubros WHERE id = $1`, [rubro_id]);
      if (rubro.rows.length === 0) {
        return res.status(404).json({ error: "rubro_id no encontrado" });
      }
    }

    // El bot siempre manda teléfono (nunca uuid) para creada_por.
    let usuarioId = creada_por || null;
    if (!usuarioId && creada_por_telefono) {
      usuarioId = await resolvePersonaIdByTelefono(creada_por_telefono);
      if (!usuarioId) {
        return res.status(404).json({ error: "creada_por_telefono no resuelve a ningún obrero" });
      }
    }

    const result = await pool.query(
      `INSERT INTO tareas (obra_id, titulo, descripcion, rubro_id, usuario_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $5)
       RETURNING *`,
      [obra_id, titulo, descripcion || null, rubro_id || null, usuarioId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando tarea desde bot" });
  }
}

// PATCH /tareas/:id — corregir un reporte (título, descripción, a qué rubro está tageado)
export async function actualizarTarea(req, res) {
  const { id } = req.params;
  const { titulo, descripcion, rubro_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tareas
       SET titulo = COALESCE($1, titulo),
           descripcion = COALESCE($2, descripcion),
           rubro_id = COALESCE($3, rubro_id)
       WHERE id = $4
       RETURNING *`,
      [titulo, descripcion, rubro_id, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando tarea" });
  }
}
