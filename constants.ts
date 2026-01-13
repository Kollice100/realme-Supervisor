
import { Sale, Salesperson, Store } from './types';

export const INITIAL_STORES: Store[] = [
  { id: 's1', name: 'Realme Centro', location: 'Av. Principal, 100' },
  { id: 's2', name: 'Realme Shopping', location: 'Piso L2, Loja 45' },
  { id: 's3', name: 'Realme Online', location: 'E-commerce' },
];

export const INITIAL_SALESPERSONS: Salesperson[] = [
  { id: '1', name: 'Ana Silva', role: 'Promotor', avatar: 'https://picsum.photos/seed/ana/200', target: 50, storeIds: ['s1'] },
  { id: '2', name: 'Bruno Costa', role: 'Promotor', avatar: 'https://picsum.photos/seed/bruno/200', target: 40, storeIds: ['s2'] },
  { id: '3', name: 'Carla Souza', role: 'Gerente', avatar: 'https://picsum.photos/seed/carla/200', target: 100, storeIds: ['s1', 's2'] },
  { id: '4', name: 'Diego Oliveira', role: 'Supervisor', avatar: 'https://picsum.photos/seed/diego/200', target: 80, storeIds: ['s2'] },
  { id: '5', name: 'Elena Santos', role: 'Promotor', avatar: 'https://picsum.photos/seed/elena/200', target: 45, storeIds: ['s3'] },
];

export const INITIAL_SALES: Sale[] = [
  { id: '101', salespersonId: '1', storeId: 's1', amount: 1500, date: '2023-10-01', product: 'Software SaaS', customer: 'Empresa A' },
  { id: '102', salespersonId: '2', storeId: 's2', amount: 800, date: '2023-10-02', product: 'Treinamento', customer: 'Loja B' },
  { id: '103', salespersonId: '3', storeId: 's1', amount: 2200, date: '2023-10-03', product: 'Licença Enterprise', customer: 'Hospital C' },
  { id: '104', salespersonId: '1', storeId: 's3', amount: 3000, date: '2023-10-04', product: 'Software SaaS', customer: 'Tech Corp' },
  { id: '105', salespersonId: '5', storeId: 's2', amount: 450, date: '2023-10-05', product: 'Consultoria', customer: 'Pequena Empresa' },
  { id: '106', salespersonId: '4', storeId: 's1', amount: 1200, date: '2023-10-06', product: 'Equipamento', customer: 'Indústria D' },
  { id: '107', salespersonId: '3', storeId: 's2', amount: 1800, date: '2023-10-07', product: 'Licença Enterprise', customer: 'Banco E' },
  { id: '108', salespersonId: '2', storeId: 's3', amount: 500, date: '2023-10-08', product: 'Suporte', customer: 'Escola F' },
];
