import type { User } from "../types/api.types";

const API_URL = process.env.API_URL;

export async function registerUser(phone: string, name: string, obra_id: string) {
  const res = await fetch(`${API_URL}/obreros/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telefono: phone, nombre: name, obra_id: obra_id }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export async function getUserByPhone(phone: string): Promise<User | null> {
  const res = await fetch(`${API_URL}/obreros/telefono/${phone}`);

  if (!res.ok) {
    return null;
  }

  const data = await res.json() as User;
  if (!data.obras || data.obras.length === 0) {
    return null;
  }

  return data;
}
