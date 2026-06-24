export interface Person {
  who: string;
  name: string;
  role: string;
  tasks: number;
  reports: number;
}

export interface Obrero {
  id: number;
  name: string;
  phone: string;
  link: string;
  sent: boolean;
}

export const PEOPLE: Person[] = [
  { who: 'JM', name: 'J. Méndez',  role: 'Director de obra', tasks: 14, reports: 38 },
  { who: 'CR', name: 'C. Ríos',    role: 'Capataz',          tasks: 7,  reports: 22 },
  { who: 'PS', name: 'P. Salas',   role: 'Capataz',          tasks: 9,  reports: 31 },
  { who: 'LB', name: 'L. Benítez', role: 'Compras',          tasks: 4,  reports: 18 },
  { who: 'MO', name: 'M. Ortiz',   role: 'Capataz',          tasks: 6,  reports: 12 },
  { who: 'AG', name: 'A. Gómez',   role: 'Arquitecta',       tasks: 3,  reports: 9 },
];

export const OBREROS: Obrero[] = [
  { id: 1, name: 'Ramón Díaz',  phone: '+54 9 11 5567-2034', link: 'wa.me/buildata/ob-9f2a1c4d', sent: true },
  { id: 2, name: 'Luis Paniagua', phone: '+54 9 11 4421-8890', link: 'wa.me/buildata/ob-3b7e0a92', sent: true },
];

export const ROLES = ['Sin asignar', 'Director de obra', 'Capataz', 'Compras', 'Arquitecto/a', 'Ingeniero/a', 'Seguridad e higiene', 'Cliente / propietario'];
