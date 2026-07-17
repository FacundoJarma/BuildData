import { supabase } from "../supabaseClient.js";
import { pool } from "../db.js";

// Usar en cualquier route que requiera estar logueado:
// router.get("/algo", authMiddleware, elController)

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  // Supabase verifica el token y devuelve el usuario
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }

  // Adjuntamos el usuario al request para usarlo en los controllers
  req.user = data.user;

  // Resolver auth_user_id → personas.id para que los controllers
  // puedan usar req.personaId al insertar en tablas que referencian personas
  try {
    const { rows } = await pool.query(
      `SELECT id FROM personas WHERE auth_user_id = $1`,
      [data.user.id]
    );
    if (rows[0]) {
      req.personaId = rows[0].id;
    }
  } catch (dbError) {
    console.error("Error resolviendo persona_id:", dbError);
  }

  next();
}