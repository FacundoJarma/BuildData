import { pool } from "../db.js";

// GET /reportes/:obra_id
export async function getReportes(req, res) {
  const { obra_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM reportes WHERE obra_id = $1 ORDER BY fecha_generacion DESC`,
      [obra_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo reportes" });
  }
}

// POST /reportes — crear reporte (lo va a llamar el sistema automáticamente cada semana)
export async function crearReporte(req, res) {
  const { obra_id, titulo, contenido } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO reportes (obra_id, titulo, contenido)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [obra_id, titulo, contenido]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando reporte" });
  }
}