// src/handlers/pendingQuery.store.ts
import { ComprobanteData, FacturaData } from "../services/vision.service";

export interface RawOperation {
  action: "insert" | "update";
  table: string;
  data: Record<string, unknown>;
  where?: Record<string, unknown>;
  comment?: string;
  error?: string;
}

export type PendingQuery =
  | { type: "operation"; operation: RawOperation; obra_id?: number }
  | { type: "comprobante"; data: ComprobanteData; obra_id?: number }
  | { type: "factura"; data: FacturaData; obra_id?: number };

const pendingQueries = new Map<string, PendingQuery>();

export function setPending(phone: string, query: PendingQuery): void {
  pendingQueries.set(phone, query);
}

export function getPending(phone: string): PendingQuery | undefined {
  return pendingQueries.get(phone);
}

export function clearPending(phone: string): void {
  pendingQueries.delete(phone);
}

export function hasPending(phone: string): boolean {
  return pendingQueries.has(phone);
}