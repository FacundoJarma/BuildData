import { ORDERS } from "@/app/[obraId]/dashboard/pedidos/data";
import type { PedidoItem } from "@/app/[obraId]/dashboard/pedidos/data";

export interface PedidosData {
  orders: PedidoItem[];
}

export async function getPedidos(): Promise<PedidosData> {
  await new Promise((r) => setTimeout(r, 300));
  return { orders: JSON.parse(JSON.stringify(ORDERS)) };
}
