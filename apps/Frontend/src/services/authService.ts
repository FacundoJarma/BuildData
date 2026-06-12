const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function registerUser(
  email: string,
  password: string,
  nombre: string,
  telefono?: string
) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, nombre, telefono }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Error al registrar usuario");
  }

  return res.json() as Promise<{
    mensaje: string;
    usuario: { id: string; email: string };
  }>;
}

export async function getProfile(token: string) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Error al obtener perfil");
  }

  return res.json();
}
