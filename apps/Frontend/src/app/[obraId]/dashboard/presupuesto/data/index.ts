export interface BudgetLine {
  name: string;
  cap: number;
  spent: number;
  comp: number;
}

export const BUDGET_LINES: BudgetLine[] = [
  { name: 'Hormigón armado',  cap: 52, spent: 38, comp: 6 },
  { name: 'Mampostería',      cap: 20, spent: 21, comp: 0 },
  { name: 'Instalaciones',    cap: 24, spent: 9,  comp: 5 },
  { name: 'Terminaciones',    cap: 18, spent: 6,  comp: 2 },
  { name: 'Movimiento de suelos', cap: 10, spent: 7, comp: 2 },
];

export const CURRENCIES = {
  ARS: { sym: 'AR$', rate: 1,        dec: 0 },
  USD: { sym: 'US$', rate: 1 / 1050,   dec: 2 },
  EUR: { sym: '€',   rate: 1 / 1140,   dec: 2 },
};

export const FORECAST_ITEMS = [
  { month: 'Jun', label: 'Este mes', items: ['Hormigón armado cierra compra de hierro'], amount: 14 },
  { month: 'Jul', label: 'Próximo', items: ['Pico de mampostería + inicio instalaciones'], amount: 22 },
  { month: 'Ago', label: 'En 2 meses', items: ['Terminaciones arranca (mayor desembolso)'], amount: 28 },
];

export const RANGE_LABELS: Record<string, string> = {
  semana: 'Última semana',
  mes: 'Último mes',
  trim: 'Último trimestre',
  total: 'Toda la obra',
};
