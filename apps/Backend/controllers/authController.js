import { supabase } from "../supabaseClient.js";
import { pool } from "../db.js";

// POST /auth/register
// Body: { email, password, nombre, telefono }
export async function register(req, res) {
  const { email, password, nombre, telefono } = req.body;

  if (!email || !password || !nombre) {
    return res.status(400).json({ error: "email, password y nombre son requeridos" });
  }

  // 1. Crear el usuario en Supabase Auth
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const userId = data.user.id;

  // 2. Completar el perfil con nombre y teléfono
  // (el trigger ya creó la fila en perfiles, acá la actualizamos)
  try {
    await pool.query(
      `UPDATE perfiles SET nombre = $1, telefono = $2 WHERE id = $3`,
      [nombre, telefono, userId]
    );
  } catch (dbError) {
    console.error("Error actualizando perfil:", dbError);
    // No bloqueamos el registro si esto falla — el usuario ya fue creado
  }

  res.status(201).json({
    mensaje: "Usuario registrado. Revisá el email para confirmar la cuenta.",
    usuario: {
      id: userId,
      email: data.user.email,
    },
  });
}


// POST /auth/login
// Body: { email, password }
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email y password son requeridos" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  res.json({
    token: data.session.access_token,   // este token lo mandan en cada request como Bearer
    refresh_token: data.session.refresh_token,
    usuario: {
      id: data.user.id,
      email: data.user.email,
    },
  });
}


// POST /auth/logout
// Header: Authorization: Bearer <token>
export async function logout(req, res) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "Token requerido" });
  }

  const { error } = await supabase.auth.signOut(token);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ mensaje: "Sesión cerrada" });
}


// GET /auth/me
// Header: Authorization: Bearer <token>
// Devuelve el usuario logueado + su perfil
export async function getMe(req, res) {
  const userId = req.user.id;
  try {
    const perfil = await pool.query(
      `SELECT * FROM perfiles WHERE id = $1`,
      [userId]
    );
    res.json(perfil.rows);
  } catch (error) {
    console.error(error);  // acá vas a ver el error real en la terminal
    res.status(500).json({ error: error.message });  // cambiá esto temporalmente
  }
}