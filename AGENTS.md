# BuildData - Agent Guidelines

Este documento es para agentes de IA que trabajan en este proyecto. Contiene la estructura, reglas, patrones y decisiones de arquitectura.

---

## 1. Descripción del proyecto

BuildData es un sistema de gestión de obras de construcción accesible por WhatsApp. El usuario envía mensajes de texto o notas de voz en lenguaje natural y el bot genera consultas SQL para insertar/actualizar datos en una base de datos relacional. El flujo requiere confirmación explícita del usuario antes de ejecutar cualquier SQL.

### Stack completo

| Capa | Tecnología |
|------|------------|
| Monorepo | Turborepo + Bun workspaces |
| WhatsApp | whatsapp-web.js (Puppeteer) |
| LLM | Groq SDK (Llama 3.3 70B) |
| Speech-to-Text | Groq SDK (Whisper Large V3 Turbo) |
| DB | MongoDB (sesiones) + SQL externo (pendiente) |
| Server | Express.js v5 (keep-alive) |
| Frontend | Next.js 16, React 19, TailwindCSS 4 |

---

## 2. Estructura de archivos

```
BuildData/
├── apps/
│   ├── Backend/                    # ⚠️ Vacío - pendiente
│   │
│   ├── Frontend/                   # Next.js app (scaffolding)
│   │   ├── src/app/
│   │   │   ├── layout.tsx          # Root layout
│   │   │   ├── page.tsx            # Home (vacío actualmente)
│   │   │   ├── globals.css         # Estilos globales
│   │   │   └── pages/              # Páginas adicionales
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── WhatsApp-Bot/               # ⭐ App principal funcional
│       ├── src/
│       │   ├── index.ts            # Entry point: initClient → startServer
│       │   ├── client.ts           # Configuración de WhatsApp Client
│       │   ├── server.ts           # Express keep-alive (puerto 3000)
│       │   ├── mongoStore.ts       # RemoteAuth store custom para MongoDB
│       │   │
│       │   ├── commands/           # Comandos con prefijo "!"
│       │   │   ├── index.ts        # Registry (Map) + interface Command
│       │   │   ├── ayuda.command.ts
│       │   │   └── confirmAndCancel.command.ts
│       │   │
│       │   ├── handlers/           # Manejo de tipos de mensaje
│       │   │   ├── message.handler.ts      # Router principal
│       │   │   ├── freetext.handler.ts      # Texto libre → SQL
│       │   │   ├── voice.handler.ts         # Audio → transcripción → SQL
│       │   │   └── pendingQuery.store.ts    # In-memory pending queries
│       │   │
│       │   └── services/           # Servicios externos (IA)
│       │       ├── llm.service.ts            # textToSQL via Groq
│       │       └── transcription.service.ts  # transcribeAudio via Whisper
│       │
│       ├── .env                    # ⚠️ NUNCA commitear
│       ├── Dockerfile
│       ├── tsconfig.json
│       └── package.json
│
├── package.json                    # Root workspace
├── turbo.json                      # Task pipeline config
└── README.md
```

---

## 3. Flujo completo de mensajes

### 3.1 Texto libre

```
Usuario → "Registra 50 bolsas de cemento en obra Las Acacias"
    ↓
message.handler.ts → detecta que NO empieza con "!"
    ↓
freetext.handler.ts → textToSQL(mensaje) via Groq Llama 3.3
    ↓
Genera: INSERT INTO materiales (obra_id, nombre, unidad, cantidad, ...)
    ↓
setPending(phone, sql) → almacena en Map in-memory
    ↓
Bot responde con SQL generada + "¿Entendí correctamente? Respondé !confirm o !cancel"
    ↓
Usuario → "!confirm"
    ↓
confirmCommand → getPending(phone) → log SQL → reply "Datos guardados"
    ↓
⚠️ ACTUALMENTE: SQL solo se hace console.log, NO se ejecuta contra una DB real
```

### 3.2 Nota de voz

```
Usuario → envía audio/voice note
    ↓
message.handler.ts → detecta MessageTypes.VOICE/AUDIO
    ↓
voice.handler.ts → downloadMedia() → buffer base64
    ↓
transcription.service.ts → escribe tmp archivo → Groq Whisper → texto
    ↓
Limpia archivo temporal (finally { unlinkSync })
    ↓
Setea message.body = transcripción
    ↓
Pasa a handleFreeText(phone, message) → mismo flujo que texto libre
```

### 3.3 Comandos

```
Usuario → "!ayuda" / "!confirm" / "!cancel"
    ↓
message.handler.ts → detecta prefijo "!"
    ↓
getCommand(message.body) → busca en Map de comandos registrados
    ↓
Ejecuta command.execute(message)
    ↓
Si no encuentra comando y hay pending query → cancela y avisa
```

---

## 4. Esquema de base de datos (objetivo)

El LLM genera SQL para este esquema. Actualmente no se ejecuta contra ninguna DB real — es un esquema conceptual que el LLM conoce via system prompt.

```sql
obras (
  id,
  nombre,
  direccion,
  estado ENUM('activa','pausada','finalizada'),
  fecha_inicio,
  fecha_fin,
  presupuesto,
  created_at
)

usuarios (
  id,
  nombre,
  telefono,
  rol ENUM('admin','capataz','operario','cliente'),
  obra_id FK → obras,
  activo,
  created_at
)

tareas (
  id,
  obra_id FK → obras,
  titulo,
  descripcion,
  estado ENUM('pendiente','en_progreso','completada','bloqueada'),
  prioridad ENUM('baja','media','alta'),
  asignado_a FK → usuarios,
  fecha_limite,
  created_at
)

subtareas (
  id,
  tarea_id FK → tareas,
  titulo,
  completada BOOLEAN,
  created_at
)

materiales (
  id,
  obra_id FK → obras,
  nombre,
  unidad,
  cantidad,
  cantidad_minima,
  precio_unitario,
  created_at
)

gastos (
  id,
  obra_id FK → obras,
  usuario_id FK → usuarios,
  categoria ENUM('material','mano_de_obra','herramienta','otro'),
  descripcion,
  monto,
  fecha,
  created_at
)

mensajes (
  id,
  usuario_id FK → usuarios,
  obra_id FK → obras,
  tipo ENUM('texto','audio','imagen'),
  contenido,
  archivo_url,
  created_at
)

alertas (
  id,
  obra_id FK → obras,
  usuario_id FK → usuarios,
  tipo ENUM('stock_bajo','tarea_vencida','presupuesto_excedido','reporte_listo'),
  mensaje,
  leida BOOLEAN,
  created_at
)

reportes (
  id,
  obra_id FK → obras,
  usuario_id FK → usuarios,
  tipo ENUM('diario','semanal','mensual','personalizado'),
  contenido,
  fecha_desde,
  fecha_hasta,
  created_at
)
```

---

## 5. Patrones de código

### 5.1 Registro de comandos

```typescript
// commands/index.ts
export interface Command {
  name: string;           // Debe incluir el prefijo "!" ej: "!ayuda"
  description: string;    // Descripción para !ayuda
  execute: (message: Message) => Promise<void>;
}

// Registrar:
import { registerCommand } from "./commands/index";
registerCommand(miCommand);

// message.handler.ts registra todos al importar
```

### 5.2 Handlers

- **message.handler.ts**: Router principal. Detecta tipo de mensaje (TEXT, VOICE, AUDIO) y dispatcha.
- **freetext.handler.ts**: Procesa texto libre → genera SQL → guarda en pending.
- **voice.handler.ts**: Procesa audio → transcribe → delega a freetext.handler.

### 5.3 Services

- **llm.service.ts**: Stateless. Exporta `textToSQL(userMessage: string): Promise<string>`.
- **transcription.service.ts**: Stateless. Exporta `transcribeAudio(base64, mimetype): Promise<string>`.

### 5.4 Stores in-memory

- **pendingQuery.store.ts**: Simple `Map<string, string>` (phone → SQL). Volátil por diseño.

---

## 6. Convenciones de código

### Lenguaje y nombrado

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivos | kebab-case | `message.handler.ts` |
| Variables/funciones | camelCase | `handleMessage` |
| Interfaces/Types | PascalCase | `Command` |
| Constantes | UPPER_SNAKE_CASE | `PREFIX` |
| Sufijos de archivo | `.handler.ts`, `.command.ts`, `.service.ts`, `.store.ts` |

### TypeScript

- `strict` mode activado en tsconfig.json
- No usar `any` — usar `unknown` o tipos específicos
- Las funciones async siempre retornan `Promise<T>`

### Mensajes del bot

- Los mensajes al usuario van en **español rioplatense**
- Usar negrita de WhatsApp: `*texto*`
- Usar bloques de código: triple backtick para SQL
- Emojis para feedback visual: ✅ ❌ ⚠️ 💾 🚀

---

## 7. Reglas de seguridad

1. **NUNCA commitear `.env`** — contiene GROQ_API_KEY y MONGO_URI reales
2. **NUNCA loguear credenciales** — ni en console.log ni en errores
3. El system prompt del LLM prohíbe SELECT, DELETE, DROP, TRUNCATE, ALTER — solo INSERT/UPDATE
4. El bot tiene un `randomDelay(1000, 10000)` entre recepción y respuesta (anti-bot-detection)
5. En producción, Puppeteer corre con `--no-sandbox --disable-setuid-sandbox`

---

## 8. Cómo extender el bot

### Agregar un nuevo comando

1. Crear `src/comandos/mi-comando.command.ts`:
```typescript
import { Command } from "./index";

export const miComandoCommand: Command = {
  name: "!micomando",
  description: "Hace algo",
  execute: async (message) => {
    await message.reply("Hola!");
  },
};
```

2. Importar y registrar en `src/handlers/message.handler.ts`:
```typescript
import { miComandoCommand } from "../commands/mi-comando.command";
registerCommand(miComandoCommand);
```

### Agregar un nuevo handler de tipo de mensaje

1. Crear `src/handlers/mi-tipo.handler.ts`
2. Exportar `async function handleMiTipo(phone: string, message: Message)`
3. Agregar case en el switch de `message.handler.ts`:
```typescript
case MessageTypes.IMAGE:
  await handleMiTipo(phone, message);
  break;
```

### Agregar un nuevo servicio

1. Crear `src/services/mi-servicio.service.ts`
2. Exportar funciones puras/stateless
3. Usar variables de entorno via `process.env`

---

## 9. Tradeoffs y decisiones técnicas

### ¿Por qué whatsapp-web.js y no WhatsApp Cloud API?
- whatsapp-web.js usa Puppeteer y es gratuito
- No requiere aprobación de Meta
- Tradeoff: menos estable, puede romperse con updates de WhatsApp Web

### ¿Por qué Groq y no OpenAI?
- Groq ofrece Llama 3.3 70B y Whisper de forma gratuita con buena velocidad
- Tradeoff: dependes de la disponibilidad de Groq

### ¿Por qué pendingQuery.store in-memory?
- Simplicidad: un Map es suficiente para un bot de un solo usuario
- Tradeoff: si el proceso se reinicia, se pierden las consultas pendientes
- Para producción: migrar a Redis o MongoDB

### ¿Por qué Express en el bot?
- Solo es un endpoint keep-alive para que el proceso no se muera en plataformas como Render
- No tiene funcionalidad de negocio

### ¿Por qué no se ejecuta SQL todavía?
- `confirmCommand` tiene `// await sendToDb(sql);` como placeholder
- Falta implementar la conexión a la base de datos SQL real (PostgreSQL/MySQL)

---

## 10. Estado actual y próximos pasos

### ✅ Implementado
- WhatsApp client con QR login
- Session persistence en MongoDB
- Manejo de texto y voz
- Generación de SQL via LLM
- Transcripción de audio via Whisper
- Sistema de comandos (!ayuda, !confirm, !cancel)
- Pending query flow
- Express keep-alive server
- Dockerfile

### ⚠️ Incompleto
- Ejecución real de SQL contra base de datos (placeholder en confirmCommand)
- Frontend web (solo scaffolding)
- Backend API (directorio vacío)
- Manejo de imágenes
- Rate limiting
- Tests

### 🔮 Posibles mejoras
- Migrar pending queries a Redis para persistencia
- Agregar logging estructurado (pino/winston)
- Implementar health checks
- Agregar tests unitarios para handlers y services
- Implementar autenticación de usuarios
- Soporte para múltiples bots/clientes
