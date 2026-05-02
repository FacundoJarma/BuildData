// src/handlers/pendingQuery.store.ts
const pendingQueries = new Map<string, string>();

export function setPending(phone: string, sql: string): void {
  pendingQueries.set(phone, sql);
}

export function getPending(phone: string): string | undefined {
  return pendingQueries.get(phone);
}

export function clearPending(phone: string): void {
  pendingQueries.delete(phone);
}

export function hasPending(phone: string): boolean {
  return pendingQueries.has(phone);
}