
export interface Sale {
  id: string;
  salespersonId: string;
  storeId: string;
  amount: number;
  date: string;
  product: string;
  customer: string;
}

export type StaffRole = 'Promotor' | 'Supervisor' | 'Gerente';

export interface Salesperson {
  id: string;
  name: string;
  role: StaffRole;
  avatar: string;
  target: number; // Meta mensal em UNIDADES
  storeIds: string[]; // Lojas vinculadas de atuação (agora suporta múltiplas)
  managerId?: string;
  supervisorId?: string;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  managerId?: string;
}

export interface SalesInsight {
  summary: string;
  topPerformerAdvice: string;
  lowPerformerAdvice: string;
  trendAnalysis: string;
}

export type ViewState = 'dashboard' | 'sales' | 'ranking' | 'ai-insights' | 'performance' | 'stores' | 'admin';
