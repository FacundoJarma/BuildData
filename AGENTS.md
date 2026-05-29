# BuildData — Guía para agentes IA

BuildData es un bot de WhatsApp para gestión de obras. El usuario envía texto, audio o imágenes y el bot genera operaciones JSON para insertar/actualizar datos, requiriendo confirmación vía `!confirm`/`!cancel`.

## Stack y comandos clave

| Comando | Uso |
|---------|-----|
| `bun run dev` | Turbo: corre WhatsApp-Bot + Frontend en paralelo |
| `npx turbo run dev --filter=whatsapp-bot` | Solo el bot |
| `npx turbo run dev --filter=frontend` | Solo frontend |
| `bun --watch src/index.ts` | Modo dev directo (hot reload con bun) |

- Sin test framework, sin typecheck, sin formatter configurados
- `bun run lint` solo lintea Frontend (WhatsApp-Bot no tiene script lint)
- Express en puerto 3000 y Next.js también por defecto → conflictos si corren juntos
- Sin `.env.example` — crear manualmente en `apps/WhatsApp-Bot/.env`

## Arquitectura (lo que los nombres no dicen)

- **LLM genera JSON, NO SQL**: `textToOperation()` devuelve `RawOperation` (`{action, table, data, where}`), no strings SQL
- **Pending store es union type**: `PendingQuery = operation | comprobante | factura`
- **Image handler implementado**: analiza comprobantes/facturas con Groq Llama 4 Scout (`vision.service.ts`)
- **Comandos registrados**: `!ayuda`, `!confirm`, `!cancel`, `!iniciar` (registra usuario vía API externa)
- **API service**: `api.service.ts` consume backend externo desde `API_URL`

## Fuentes de verdad del schema

- `llm.service.ts:41-53` → `SYSTEM_PROMPT` (definición que ve el LLM)
- `services/tableSchema.ts` → FK relations e identity fields (para resolución de IDs)
- Si se cambia el schema, actualizar AMBOS archivos

## Servicios y modelos LLM

| Servicio | Modelo | Notas |
|----------|--------|-------|
| `llm.service` | `llama-3.3-70b-versatile` | temperature=0, genera JSON con action/table/data |
| `transcription.service` | `whisper-large-v3-turbo` | escribe tmp en `./tmp/`, limpia en `finally` |
| `vision.service` | `meta-llama/llama-4-scout-17b-16e-instruct` | analiza imágenes de comprobantes/facturas argentinas |

## Patrones de código

```
Archivos:        kebab-case.ts  → *.handler.ts, *.command.ts, *.service.ts, *.store.ts
Variables/func:  camelCase
Interfaces:      PascalCase
Async:           siempre Promise<T>
Idioma bot:      español rioplatense, *negrita* WhatsApp, bloques código ```, emojis ✅❌⚠️
```

### Registrar comando nuevo

```typescript
// 1. crear archivo .command.ts con interface Command { name, description, execute }
// 2. importar y registerCommand() en message.handler.ts
```

### Registrar handler nuevo

```typescript
// 1. crear .handler.ts exportando async function handleTipo(phone, message)
// 2. agregar case MessageTypes.TIPO en message.handler.ts
```

## Seguridad y gotchas

- `.env` contiene `GROQ_API_KEY` y `MONGO_URI` — NUNCA comitear
- Dockerfile: build desde raíz del monorepo, solo copia `apps/WhatsApp-Bot/` al container
- `mongoStore.ts` busca session zips en `.wwebjs_auth/`
- `randomDelay(1000, 10000)` entre mensaje y respuesta (anti-detección)
- En producción Puppeteer corre con `--no-sandbox --disable-setuid-sandbox`
- `getPhoneNumber()` usa `message.getContact().number`
- `tsconfig.json` module=commonjs (no module ESM a pesar de `"type": "module"` en root package.json)

## Estado

| Funcional | Pendiente |
|-----------|-----------|
| Texto → JSON LLM | Ejecución real contra DB (placeholder en confirmCommand) |
| Voz → Whisper → texto | Backend API |
| Imagen → análisis documento | Frontend con datos reales |
| Sesión MongoDB vía RemoteAuth | Tests, rate limiting |
| Express keep-alive (puerto 3000) | `.env.example` |
