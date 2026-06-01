export interface Obra {
  obra_id: number;
  obra_nombre: string;
  rol?: string;
  joined_at?: string;
}

export interface User {
  nombre: string;
  telefono: string;
  obras: Obra[];
}
