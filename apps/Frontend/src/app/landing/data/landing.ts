export const LOGOS = [
  "ESTUDIO MARCÁ",
  "CONSTRUCTORA LARIO",
  "GRUPO PARANÁ",
  "EDIFICA AR",
  "OBRAS DEL SUR",
];

export const PROBLEMA_ITEMS = [
  { icon: "message", t: "Información dispersa", s: "Los avances viven en cinco grupos de WhatsApp, dos planillas y un cuaderno." },
  { icon: "clock",   t: "Decisiones tarde",     s: "Cuando una alerta sube al director, el problema ya pasó hace 3 días." },
  { icon: "package", t: "Pedidos perdidos",     s: "\"¿Pidieron el cemento?\" \"Sí, creo.\" Faltantes que paran a cuadrillas enteras." },
  { icon: "photo",   t: "Fotos sin contexto",   s: "4.327 imágenes en la galería del jefe. Ninguna asociada a un rubro o sector." },
];

export const PROBLEMA_STATS = [
  { n: "3.4 h", l: "por día perdidas buscando información de obra" },
  { n: "72%",   l: "de las decisiones se toman con datos de más de 48 hs" },
  { n: "1 de 4", l: "pedidos llega con error o fuera de tiempo" },
];

export const FEATURES = [
  { i: "mic",      t: "Audios → datos",          s: "Transcribe y clasifica notas de voz en pedidos, avances, alertas o faltantes.", tone: "primary" },
  { i: "photo",    t: "Fotos georeferenciadas",  s: "Cada imagen queda asociada al sector, rubro y fecha. Buscable por palabra clave.", tone: "accent" },
  { i: "alert",    t: "Alertas inteligentes",    s: "El bot detecta urgencia y avisa al director sin esperar al parte diario.", tone: "critical" },
  { i: "package",  t: "Pedidos automáticos",     s: "Identifica materiales y cantidades. Arma el pedido, lo manda a aprobación.", tone: "success" },
  { i: "chart",    t: "KPIs por rubro",          s: "Avance, costos y desvíos por rubro y sector. Comparados contra el plan.", tone: "info" },
  { i: "calendar", t: "Cronograma vivo",         s: "El Gantt se actualiza solo con los avances que reportan en obra.", tone: "primary" },
  { i: "users",    t: "Roles y permisos",        s: "Capataces, directores, proveedores. Cada uno ve lo que le toca.", tone: "accent" },
  { i: "download", t: "Reportes a un clic",      s: "Informe semanal para el cliente o el inversor, generado solo.", tone: "success" },
];

export const TONE_MAP = {
  primary:  { tint: "bg-primary-50",  fg: "text-primary" },
  accent:   { tint: "bg-accent-50",   fg: "text-accent-700" },
  critical: { tint: "bg-critical50",  fg: "text-critical" },
  success:  { tint: "bg-success50",   fg: "text-[#15803D]" },
  info:     { tint: "bg-info50",      fg: "text-info" },
};

export const DASHBOARD_CALLOUTS = [
  { i: "trending", t: "Tendencias automáticas",    s: "Detecta atrasos en rubros antes de que se vuelvan críticos." },
  { i: "shield",   t: "Trazabilidad completa",     s: "Quién reportó qué, cuándo y desde dónde. Auditable." },
  { i: "users",    t: "Multi-rol, multi-obra",     s: "Director, jefe de obra, contratista, cliente. Cada uno ve lo suyo." },
];

export const BENEFICIOS_STATS = [
  { n: "12 h", l: "ahorradas por semana en seguimiento manual" },
  { n: "3×",   l: "más rápido en detectar problemas críticos" },
  { n: "0",    l: "apps nuevas para los capataces" },
  { n: "1 día", l: "de setup hasta tener el primer dashboard" },
];

export const BENEFICIOS_ITEMS = [
  {
    i: "clock",
    t: "Decisiones en horas, no en semanas",
    s: "Tu director deja de perseguir información por WhatsApp. La ve aparecer en el dashboard.",
  },
  {
    i: "wrench",
    t: "Sin cambiar de herramienta",
    s: "El equipo de obra sigue usando WhatsApp. Vos tenés un panel profesional encima.",
  },
  {
    i: "shield",
    t: "Trazabilidad para auditorías",
    s: "Quién reportó qué, cuándo y desde dónde. Listo para el cliente, el banco o la inspección.",
  },
];
