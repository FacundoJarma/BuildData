# BuildData — Guía para agentes IA

BuildData: bot WhatsApp + API REST + Frontend Web para gestión de obras de construcción. Monorepo Turborepo + Bun. El usuario envía texto/audio/imagen → LLM genera llamada a API REST (no SQL) → confirmación vía encuesta → ejecución.

## Comandos clave

| Comando | Uso |
|---------|-----|
| `bun run dev` | Turbo: WhatsApp-Bot + Frontend + Backend en paralelo |
| `npx turbo run dev --filter=whatsapp-bot` | Solo bot (Express keep-alive en puerto 3000) |
| `npx turbo run dev --filter=frontend` | Solo frontend (Next.js) |
| `bun --watch src/index.ts` | Modo dev directo del bot (hot reload) |
| `bun test` | Tests con Bun (apps/WhatsApp-Bot) |
| `bun run lint` | Lints solo Frontend (WhatsApp-Bot no tiene lint) |

- **Backend no tiene package.json** → no funciona con `--filter=backend`. Correr manual: `node apps/Backend/server.js` (puerto 3001)
- Sin `.env.example` — crear manualmente en `apps/WhatsApp-Bot/.env` y `apps/Backend/.env`
- Express: bot en puerto 3000, Backend API en puerto 3001
- Existe `bun.lock` y `package-lock.json` — usar `bun install`

## Arquitectura (lo que los nombres no dicen)

- **LLM genera endpoint + JSON body, NO SQL**: `textToOperation()` devuelve `{endpoint, method, data, comment}`, no un `RawOperation` con action/table/data
- **Pending store es union type**: `PendingQuery = operation \| comprobante \| factura`
- **Confirmación vía Poll**: `pollConfirmation.service.ts` envía encuesta "¿En qué obra?" → `handlePollVote()` → `executePending()` (la llamada a API está comentada — placeholder)
- **Comandos registrados**: `!ayuda`, `!cancel`, `!iniciar`, `!obras` — **NO existe `!confirm`**
- **Whitelist de comandos sin verificar obra**: `!iniciar` y `!ayuda` (saltan `getUserObras`)
- **User cache**: `user.service.ts` cachea usuarios 5 min en Map en memoria

## Fuentes de verdad del schema

- `services/endpointSchema.ts` → define endpoints, parámetros requeridos/opcionales y fuentes (`llm`, `obra_poll`, `user_phone`, `auto`)
- `services/llm.service.ts:10-33` → `SYSTEM_PROMPT` (lo que ve el LLM)
- Si se cambia el schema, actualizar AMBOS archivos

## Servicios y modelos LLM

| Servicio | Modelo | Notas |
|----------|--------|-------|
| `llm.service` | `llama-3.3-70b-versatile` | temperature=0, genera endpoint+JSON |
| `transcription.service` | `whisper-large-v3-turbo` | escribe tmp en `./tmp/`, limpia en `finally` |
| `vision.service` | `meta-llama/llama-4-scout-17b-16e-instruct` | analiza comprobantes/facturas argentinas vía Groq |

## Variables de entorno

- **WhatsApp-Bot**: `GROQ_API_KEY`, `MONGO_URI`, `NODE_ENV`, `SUPABASE_SERVICE_ROLE_KEY`, `API_URL`
- **Backend**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`
- NUNCA comitear `.env`

## Patrones de código

```
Archivos:        kebab-case.ts  → *.handler.ts, *.command.ts, *.service.ts, *.store.ts
Variables/func:  camelCase
Interfaces:      PascalCase
Async:           siempre Promise<T>
Stores:          Map en memoria (pendingQuery, userCache con TTL 5 min)
Idioma bot:      español rioplatense, *negrita* WhatsApp, bloques ```, emojis ✅❌⚠️
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

- `.env` contiene `GROQ_API_KEY`, `MONGO_URI`, `SUPABASE_SERVICE_ROLE_KEY` — NUNCA comitear
- Dockerfile: build desde raíz del monorepo, solo copia `apps/WhatsApp-Bot/` al container
- `mongoStore.ts` busca session zips en `.wwebjs_auth/`
- `randomDelay(1000, 10000)` entre mensaje y respuesta (anti-detección)
- En producción Puppeteer: `--no-sandbox --disable-setuid-sandbox`
- `getPhoneNumber()` usa `message.getContact().number` (sin @c.us)
- `tsconfig.json` `module: commonjs` (no ESM a pesar de `"type": "module"` en root package.json)
- Backend tiene dos middlewares de auth: `botAuthMiddleware` (valida service role key directo) para `/bot/*`, `authMiddleware` (JWT Supabase via `auth.getUser()`) para el resto
- `executePending()` en `pollConfirmation.service.ts` tiene la llamada `callEndpoint()` comentada — no ejecuta nada real todavía

## Apps

| App | Puerto | Stack | Estado |
|------|--------|-------|--------|
| WhatsApp-Bot | 3000 | whatsapp-web.js, Express (keep-alive) | ✅ Funcional |
| Backend | 3001 | Express + Supabase/PostgreSQL (15 rutas REST) | ✅ Implementado |
| Frontend | Next.js default | Next.js 16, React 19, TailwindCSS 4 | 🚧 En desarrollo |
