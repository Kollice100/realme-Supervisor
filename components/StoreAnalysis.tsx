
import React, { useMemo, useState } from 'react';
import { Sale, Store, Salesperson } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, Legend 
} from 'recharts';
import { INITIAL_STORES, INITIAL_SALESPERSONS } from '../constants';

interface StoreAnalysisProps {
  sales: Sale[];
}

const StoreAnalysis: React.FC<StoreAnalysisProps> = ({ sales }) => {
  const stores = INITIAL_STORES;
  const [timeView, setTimeView] = useState<'daily' | 'weekly'>('daily');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const storeStats = useMemo(() => {
    return stores.map(store => {
      const filteredSales = sales.filter(s => s.storeId === store.id);
      const revenue = filteredSales.reduce((sum, s) => sum + s.amount, 0);
      return {
        ...store,
        revenue,
        salesCount: filteredSales.length,
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [sales, stores]);

  const selectedStore = useMemo(() => 
    stores.find(s => s.id === selectedStoreId), 
  [selectedStoreId, stores]);

  const storeSales = useMemo(() => 
    sales.filter(s => s.storeId === selectedStoreId).reverse(),
  [sales, selectedStoreId]);

  const timeSeriesData = useMemo(() => {
    const uniqueDates = Array.from(new Set(sales.map(s => s.date))).sort();
    
    return uniqueDates.map(date => {
      const entry: any = { date };
      stores.forEach(store => {
        const amount = sales
          .filter(s => s.date === date && s.storeId === store.id)
          .reduce((sum, s) => sum + s.amount, 0);
        entry[store.name] = amount;
      });
      return entry;
    });
  }, [sales, stores]);

  const totalRevenue = storeStats.reduce((sum, s) => sum + s.revenue, 0);
  const COLORS = ['#f59e0b', '#fbbf24', '#facc15', '#ea580c', '#d97706'];

  if (selectedStoreId && selectedStore) {
    const stats = storeStats.find(s => s.id === selectedStoreId);
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => setSelectedStoreId(null)}
            className="flex items-center text-slate-400 hover:text-amber-600 font-black text-xs uppercase tracking-widest transition-colors group"
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            Voltar para Análise Geral
          </button>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Detalhes da Unidade</span>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black lowercase tracking-tighter mb-1">{selectedStore.name}</h2>
            <p className="text-amber-500 font-bold text-sm flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {selectedStore.location}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Faturamento Total</p>
                <p className="text-xl font-black text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.revenue || 0)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Volume de Vendas</p>
                <p className="text-xl font-black text-white">{stats?.salesCount} Unidades</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
             <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Registro de Atividades</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Promotor</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {storeSales.length > 0 ? storeSales.map((sale) => {
                  const seller = INITIAL_SALESPERSONS.find(s => s.id === sale.salespersonId);
                  return (
                    <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 text-xs font-bold text-slate-500 whitespace-nowrap">{sale.date}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-3">
                          <img src={seller?.avatar} className="w-7 h-7 rounded-full" alt="" />
                          <span className="text-sm font-black text-slate-900">{seller?.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-600">{sale.customer}</td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                          {sale.product}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-slate-900 text-right">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.amount)}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic">
                      Nenhuma venda registrada nesta unidade ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo em Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {storeStats.slice(0, 3).map((store, index) => (
          <div 
            key={store.id} 
            onClick={() => setSelectedStoreId(store.id)}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all hover:shadow-lg cursor-pointer active:scale-[0.98]"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:opacity-20 transition-opacity bg-amber-500`}></div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Top Unidade #{index + 1}</p>
            <h3 className="text-lg font-black text-slate-900">{store.name}</h3>
            <p className="text-2xl font-black text-amber-600 mt-2">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(store.revenue)}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-bold">{store.salesCount} vendas realizadas</p>
            <div className="mt-4 flex items-center text-[10px] font-black text-amber-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Ver Detalhes
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos de Evolução Temporal */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center">
            <span className="w-2 h-6 bg-amber-500 rounded-full mr-3"></span>
            Histórico de Performance por Unidade
          </h3>
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button 
               onClick={() => setTimeView('daily')}
               className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${timeView === 'daily' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Diário
             </button>
             <button 
               onClick={() => setTimeView('weekly')}
               className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${timeView === 'weekly' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Semanal
             </button>
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(val) => `R$${val}`} 
                tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                labelStyle={{ fontWeight: 900, marginBottom: '8px', color: '#64748b' }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}
              />
              {stores.map((store, index) => (
                <Line 
                  key={store.id}
                  type="monotone" 
                  dataKey={store.name} 
                  stroke={COLORS[index % COLORS.length]} 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparativo de Receita Acumulada */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center">
            <span className="w-2 h-6 bg-amber-400 rounded-full mr-3"></span>
            Receita Total Acumulada
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storeStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val/1000}k`} tick={{fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: '#fff7ed'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), 'Receita']}
                />
                <Bar 
                  dataKey="revenue" 
                  radius={[10, 10, 0, 0]} 
                  barSize={40}
                  onClick={(data) => data && setSelectedStoreId(data.id)}
                  className="cursor-pointer"
                >
                  {storeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Participação de Mercado */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center">
            <span className="w-2 h-6 bg-yellow-400 rounded-full mr-3"></span>
            Market Share por Unidade
          </h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storeStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="revenue"
                  onClick={(data) => data && setSelectedStoreId(data.id)}
                  className="cursor-pointer"
                >
                  {storeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Geral</span>
                <span className="text-sm font-black text-slate-900">R${(totalRevenue/1000).toFixed(1)}k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela Detalhada de Lojas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Ranking de Unidades</h3>
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">CLIQUE NA LINHA PARA DETALHES</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loja</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Localização</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Vendas</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Bruto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {storeStats.map((store) => (
                <tr 
                  key={store.id} 
                  onClick={() => setSelectedStoreId(store.id)}
                  className="hover:bg-amber-50/20 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 font-bold text-slate-900">
                    <div className="flex items-center">
                      <div className="w-1.5 h-6 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {store.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{store.location}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{store.salesCount}</td>
                  <td className="px-6 py-4 text-sm font-black text-amber-600 text-right">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(store.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreAnalysis;
