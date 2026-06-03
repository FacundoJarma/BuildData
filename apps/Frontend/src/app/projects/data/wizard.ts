export const TYPES = [
  { id: "edificio",  name: "Edificio en altura",     icon: "chart",    sub: "8 rubros · ~120 tareas · 14 meses" },
  { id: "vivienda",  name: "Vivienda unifamiliar",   icon: "grid",     sub: "6 rubros · ~60 tareas · 6 meses" },
  { id: "refaccion", name: "Refacción / remodelación", icon: "package", sub: "4 rubros · ~30 tareas · 3 meses" },
  { id: "comercial", name: "Comercial / industrial", icon: "truck",    sub: "Custom · variable según proyecto" },
];

export const TEMPLATES = [
  { id: "desde-cero", name: "Empezar desde cero",          sub: "Yo cargo el cronograma manualmente." },
  { id: "plantilla",  name: "Usar plantilla del tipo elegido", sub: "Cronograma sugerido que después editás.", recommended: true },
  { id: "importar",   name: "Importar Excel / MS Project", sub: "Subí tu Gantt y lo parseamos." },
];

export const PEOPLE = [
  { id: "JM", name: "J. Méndez",  role: "Director" },
  { id: "CR", name: "C. Ríos",    role: "Capataz" },
  { id: "PS", name: "P. Salas",   role: "Capataz" },
  { id: "LB", name: "L. Benítez", role: "Compras" },
  { id: "MO", name: "M. Ortiz",   role: "Capataz" },
  { id: "AG", name: "A. Gómez",   role: "Arquitecta" },
];

export const STEPS = [
  { id: 1, label: "Básicos",     sub: "Nombre y tipo" },
  { id: 2, label: "Ubicación",   sub: "Dónde está" },
  { id: 3, label: "Equipo",      sub: "Quién participa" },
  { id: 4, label: "Cronograma",  sub: "Cómo arrancás" },
];

export const ROLES = [
  { id: "director",   label: "Director de obra", sub: "Ve todo. Aprueba pedidos." },
  { id: "arquitecto", label: "Arquitecto/a",     sub: "Revisa avance y fotos." },
  { id: "compras",    label: "Compras",          sub: "Gestiona pedidos." },
  { id: "capataz",    label: "Capataz",          sub: "Reporta desde obra." },
];
