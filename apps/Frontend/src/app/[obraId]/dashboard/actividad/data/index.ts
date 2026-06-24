export interface ActivityItem {
  who: string;
  name: string;
  role: string;
  time: string;
  kind: string;
  text: string;
  tags: string[];
  severity?: string;
}

export interface ActivityGroup {
  d: string;
  items: ActivityItem[];
}

export const ACTIVITY_GROUPS: ActivityGroup[] = [
  { d: 'Hoy', items: [
    { who: 'JM', name: 'J. Méndez',  role: 'Director', time: '08:42', kind: 'avance',   text: 'Hormigonado losa +3 completado. Volumen final 28 m³.', tags: ['Hormigón'] },
    { who: 'CR', name: 'C. Ríos',    role: 'Capataz',  time: '10:15', kind: 'foto',     text: 'Subió 4 fotos — armado de columnas.',     tags: ['Foto'] },
    { who: 'PS', name: 'P. Salas',   role: 'Capataz',  time: '12:48', kind: 'problema', text: 'Falla en Grúa Torre 2. Motor no responde.',           tags: ['Crítico'], severity: 'critical' },
  ]},
  { d: 'Ayer', items: [
    { who: 'LB', name: 'L. Benítez', role: 'Compras', time: '17:30', kind: 'pedido',   text: 'Pedido de cemento aprobado y enviado al proveedor.', tags: ['PED-0142', 'Compras'] },
    { who: 'MO', name: 'M. Ortiz',   role: 'Capataz', time: '18:05', kind: 'cierre',   text: 'Cierre de jornada — 6 personas, 0 incidentes.', tags: ['Cierre'] },
  ]},
];

export const KIND_ICONS: Record<string, { ico: string; tint: string }> = {
  avance:   { ico: 'check',    tint: 'bg-success-50 text-[#15803D]' },
  foto:     { ico: 'photo',    tint: 'bg-info-50 text-[#1D4ED8]' },
  problema: { ico: 'alert',    tint: 'bg-critical-50 text-[#B91C1C]' },
  pedido:   { ico: 'package',  tint: 'bg-attention-50 text-[#A16207]' },
  cierre:   { ico: 'calendar', tint: 'bg-primary-50 text-primary' },
};

export const SUGGESTED_QUESTIONS = [
  '¿Cuántas horas se trabajaron esta semana?',
  '¿Qué pedidos vencen en los próximos 7 días?',
  'Resumen de problemas críticos del mes',
];

export const ANSWERS_DB: Record<string, string> = {
  '¿Cuántas horas se trabajaron esta semana?': 'Se trabajaron **184 hs** esta semana, 12 % menos que la anterior. Caída atribuible a la falla de Grúa Torre 2 (jueves).',
  '¿Qué pedidos vencen en los próximos 7 días?': 'Vencen 4 pedidos: **PED-0140** (Ladrillo, 22 Oct), **PED-0141** (Hierro 12 mm, 18 Oct), **PED-0143** (Arena, 21 Oct) y **PED-0144** (Pintura, 23 Oct). 1 está sin aprobar.',
  'Resumen de problemas críticos del mes': 'Este mes hubo **6 alertas críticas**: 3 por faltantes de material, 2 por fallas técnicas y 1 por accidente leve. Tiempo promedio de resolución: 14 hs.',
};
