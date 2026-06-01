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

// POST /obreros/registrar
export async function registrarObrero(req, res) {
  const { nombre, telefono, obra_id, rol } = req.body;

  if (!nombre || !telefono || !obra_id) {
    return res.status(400).json({
      error: "nombre, telefono y obra_id son requeridos"
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Buscar obrero por teléfono
    let obrero = await client.query(
      `SELECT * FROM obreros WHERE telefono = $1`,
      [telefono]
    );

    let obrero_id;
    let creado = false;

    // Si no existe → crearlo
    if (obrero.rows.length === 0) {
      const nuevoObrero = await client.query(
        `INSERT INTO obreros (nombre, telefono)
         VALUES ($1, $2)
         RETURNING *`,
        [nombre, telefono]
      );

      obrero = nuevoObrero;
      obrero_id = nuevoObrero.rows[0].id;
      creado = true;
    } else {
      obrero_id = obrero.rows[0].id;
    }

    // Verificar si ya está asignado a la obra
    const asignacionExistente = await client.query(
      `SELECT *
       FROM obreros_obras
       WHERE obrero_id = $1
       AND obra_id = $2`,
      [obrero_id, obra_id]
    );

    let asignado = false;

    if (asignacionExistente.rows.length === 0) {
      await client.query(
        `INSERT INTO obreros_obras (obrero_id, obra_id, rol)
         VALUES ($1, $2, $3)`,
        [obrero_id, obra_id, rol]
      );

      asignado = true;
    }

    await client.query("COMMIT");

    res.status(200).json({
      obrero: obrero.rows[0],
      creado,
      asignado,
      mensaje: creado
        ? "Obrero creado y asignado a la obra"
        : asignado
        ? "Obrero existente asignado a la obra"
        : "El obrero ya estaba asignado a la obra"
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  } finally {
    client.release();
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

// GET /obreros/telefono/:telefono
export async function getObrasPorTelefono(req, res) {
  const { telefono } = req.params;

  try {
    const result = await pool.query(
      `SELECT
          o.nombre AS obrero_nombre,
          o.telefono,
          ob.id AS obra_id,
          ob.nombre AS obra_nombre,
          oo.rol,
          oo.joined_at
       FROM obreros o
       JOIN obreros_obras oo ON o.id = oo.obrero_id
       JOIN obras ob ON ob.id = oo.obra_id
       WHERE o.telefono = $1
       ORDER BY ob.nombre`,
      [telefono]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "No se encontró ningún obrero con ese teléfono"
      });
    }

    res.json({
      nombre: result.rows[0].obrero_nombre,
      telefono: result.rows[0].telefono,
      obras: result.rows.map(row => ({
        obra_id: row.obra_id,
        obra_nombre: row.obra_nombre,
        rol: row.rol,
        joined_at: row.joined_at
      }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}