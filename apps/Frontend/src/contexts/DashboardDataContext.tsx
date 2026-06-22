"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { TaskItem } from "@/types/dashboard";

export interface LookupData {
  rubros: string[];
  tasks: TaskItem[];
  workers: string[];
}

interface ContextValue {
  data: LookupData;
  setLookupData: (data: LookupData) => void;
}

const DashboardDataContext = createContext<ContextValue>({
  data: { rubros: [], tasks: [], workers: [] },
  setLookupData: () => {},
});

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LookupData>({ rubros: [], tasks: [], workers: [] });
  const setLookupData = useCallback((d: LookupData) => setData(d), []);
  return (
    <DashboardDataContext.Provider value={{ data, setLookupData }}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  return useContext(DashboardDataContext);
}
