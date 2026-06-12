import { pool } from "../db.js";

// GET /obreros/:obra_id — obreros de una obra
export async function getObreros(req, res) {
  const { obra_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT o.*, oo.rol, oo.joined_at
       FROM obreros o
       JOIN obreros_obras oo ON o.id = oo.obrero_id
       WHERE oo.obra_id = $1
       ORDER BY o.nombre ASC`,
      [obra_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// POST /bot/obreros/registrar — el bot crea un obrero y opcionalmente lo asigna a una obra
export async function registrarObrero(req, res) {
  const { nombre, telefono, obra_id, rol } = req.body;
  if (!nombre) return res.status(400).json({ code: "VALIDATION_ERROR", message: "nombre es requerido" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const obrero = await client.query(
      `INSERT INTO obreros (nombre, telefono) VALUES ($1, $2) RETURNING *`,
      [nombre, telefono]
    );

    if (obra_id) {
      await client.query(
        `INSERT INTO obreros_obras (obrero_id, obra_id, rol) VALUES ($1, $2, $3)`,
        [obrero.rows[0].id, obra_id, rol || null]
      );
    }

    await client.query("COMMIT");
    res.status(201).json(obrero.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ code: "SERVER_ERROR", message: error.message });
  } finally {
    client.release();
  }
}

  const { nombre, telefono } = req.body;
  if (!nombre) return res.status(400).json({ error: "nombre es requerido" });
  try {
    const result = await pool.query(
      `INSERT INTO obreros (nombre, telefono) VALUES ($1, $2) RETURNING *`,
      [nombre, telefono]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

// POST /obreros/asignar-obra — vincular obrero a una obra con rol
export async function asignarObraObrero(req, res) {
  const { obrero_id, obra_id, rol } = req.body;
  if (!obrero_id || !obra_id) return res.status(400).json({ error: "obrero_id y obra_id son requeridos" });
  try {
    const result = await pool.query(
      `INSERT INTO obreros_obras (obrero_id, obra_id, rol)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [obrero_id, obra_id, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// DELETE /obreros/:obrero_id/obra/:obra_id — quitar obrero de una obra
export async function quitarObreroDeObra(req, res) {
  const { obrero_id, obra_id } = req.params;
  try {
    await pool.query(
      `DELETE FROM obreros_obras WHERE obrero_id = $1 AND obra_id = $2`,
      [obrero_id, obra_id]
    );
    res.json({ mensaje: "Obrero quitado de la obra" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}