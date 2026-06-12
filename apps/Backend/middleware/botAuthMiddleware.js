// Middleware para endpoints /bot/*
// El bot de Facu manda la SUPABASE_SERVICE_ROLE_KEY en el header,
// no un JWT de usuario. auth.getUser() la rechazaría con 401,
// así que la validamos directo contra el valor en .env.

export function botAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Token de servicio requerido" });
  }

  const token = authHeader.split(" ")[1];

  if (token !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Token de servicio inválido" });
  }

  next();
}