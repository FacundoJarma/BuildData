import { supabase } from "../supabaseClient.js";

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
  next();
}