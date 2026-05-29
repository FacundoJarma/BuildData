export interface Obra {
  id: number;
  nombre: string;
  direccion?: string;
  estado?: string;
}

export interface User {
  id: number;
  nombre: string;
  telefono: string;
  rol: string;
  obras: Obra[];
}
