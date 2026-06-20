import Groq from "groq-sdk";
import { buildEndpointDescription } from "./endpointSchema";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const ENDPOINTS_DESC = buildEndpointDescription();

const SYSTEM_PROMPT = `
Sos un asistente que convierte mensajes de WhatsApp de obreros de la construcción en llamadas a una API REST.

Respondé ÚNICAMENTE con el JSON, sin explicaciones, sin markdown, sin backticks.

Formato:
{
  "endpoint": "/bot/...",
  "method": "POST",
  "data": { "campo": valor, ... },
  "comment": "explicación en español de lo que vas a hacer"
}

Endpoints disponibles:

${ENDPOINTS_DESC}

Reglas:
- Elegí el endpoint que mejor matchee la intención del mensaje
- Los campos que son nombres (materiales, tareas, proveedores) se pasan con el NOMBRE, no el ID
- No incluyas obra_id ni telefono en el JSON, esos se agregan automáticamente después
- Si el usuario no da suficiente información para un campo requerido, responded: {"error": "explicación del motivo"}
- El comment debe ser amigable y describir la acción, ej: "Voy a registrar el uso de 10 bolsas de cemento"
`;

export async function textToOperation(userMessage: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  const result = response.choices[0].message.content?.trim() ?? "";
  return result;
}
