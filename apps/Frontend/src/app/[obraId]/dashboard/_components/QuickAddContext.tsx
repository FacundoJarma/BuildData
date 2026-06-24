"use client";

import { createContext, useContext, useCallback, useState, type ReactNode } from "react";

interface QuickAddContextValue {
  quickAdd: string | null;
  openQuickAdd: (kind: string) => void;
  closeQuickAdd: () => void;
}

const QuickAddContext = createContext<QuickAddContextValue>({
  quickAdd: null,
  openQuickAdd: () => {},
  closeQuickAdd: () => {},
});

export function QuickAddProvider({ children }: { children: ReactNode }) {
  const [quickAdd, setQuickAdd] = useState<string | null>(null);
  const openQuickAdd = useCallback((kind: string) => setQuickAdd(kind), []);
  const closeQuickAdd = useCallback(() => setQuickAdd(null), []);

  return (
    <QuickAddContext.Provider value={{ quickAdd, openQuickAdd, closeQuickAdd }}>
      {children}
    </QuickAddContext.Provider>
  );
}

export function useQuickAdd() {
  return useContext(QuickAddContext);
}
