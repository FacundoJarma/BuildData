export interface Person {
  who: string;
  name: string;
  role: string;
  tasks: number;
  reports: number;
}

export interface Obrero {
  id: string;
  name: string;
  phone: string;
  link: string;
  sent: boolean;
}

export const ROLES = ['Sin asignar', 'Director de obra', 'Capataz', 'Compras', 'Arquitecto/a', 'Ingeniero/a', 'Seguridad e higiene', 'Cliente / propietario'];
