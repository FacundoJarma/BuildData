import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const result = await pool.query(
    `SELECT o.* FROM obras o
     JOIN usuarios_obras uo ON uo.obra_id = o.id
     WHERE uo.usuario_id = $1`, [req.user.id]
  );
  res.json(result.rows);
});

router.post("/", async (req, res) => {
  const { nombre, direccion, descripcion, fecha_inicio, fecha_fin_estimada, presupuesto_total } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const obra = await client.query(
      `INSERT INTO obras (nombre, direccion, descripcion, fecha_inicio, fecha_fin_estimada, presupuesto_total)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nombre, direccion, descripcion, fecha_inicio, fecha_fin_estimada, presupuesto_total]
    );
    // Asignar al creador automáticamente
    await client.query(
      `INSERT INTO usuarios_obras (usuario_id, obra_id, cargo) VALUES ($1,$2,'administrador')`,
      [req.user.id, obra.rows[0].id]
    );
    await client.query("COMMIT");
    res.status(201).json(obra.rows[0]);
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: e.message });
  } finally { client.release(); }
});

export default router;