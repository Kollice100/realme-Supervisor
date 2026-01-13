
import React, { useState, useMemo } from 'react';
import { Sale, Salesperson } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceProps {
  sales: Sale[];
  salespeople: Salesperson[];
}

const SalespersonPerformance: React.FC<PerformanceProps> = ({ sales, salespeople }) => {
  const [selectedId, setSelectedId] = useState<string>(salespeople[0]?.id || '');

  const selectedSalesperson = useMemo(() => 
    salespeople.find(s => s.id === selectedId), 
  [selectedId, salespeople]);

  const performanceData = useMemo(() => {
    if (!selectedId) return { stats: null, chartData: [] };

    const personSales = sales.filter(s => s.salespersonId === selectedId);
    const totalRevenue = personSales.reduce((sum, s) => sum + s.amount, 0);
    const avgSale = personSales.length ? totalRevenue / personSales.length : 0;
    
    // Sort and group by date for chart
    const groupedByDate = personSales.reduce((acc, sale) => {
      const date = sale.date;
      acc[date] = (acc[date] || 0) + sale.amount;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(groupedByDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      stats: {
        totalRevenue,
        avgSale,
        count: personSales.length,
      },
      chartData
    };
  }, [sales, selectedId]);

  return (
    <div className="space-y-8">
      {/* Salespeople Selector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Selecionar Promotor</h3>
        <div className="flex space-x-6 min-w-max pb-2">
          {salespeople.map((person) => (
            <button
              key={person.id}
              onClick={() => setSelectedId(person.id)}
              className={`flex flex-col items-center space-y-3 transition-all p-2 rounded-xl group ${
                selectedId === person.id 
                  ? 'bg-amber-50 scale-105' 
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className={`relative p-1 rounded-full border-2 transition-colors ${
                selectedId === person.id ? 'border-amber-500' : 'border-transparent group-hover:border-slate-200'
              }`}>
                <img src={person.avatar} className="w-14 h-14 rounded-full object-cover" alt={person.name} />
                {selectedId === person.id && (
                   <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 border-2 border-white">
                      <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                   </div>
                )}
              </div>
              <span className={`text-xs font-bold transition-colors ${
                selectedId === person.id ? 'text-amber-700' : 'text-slate-500 group-hover:text-slate-900'
              }`}>
                {person.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedSalesperson && performanceData.stats && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
            
            <img src={selectedSalesperson.avatar} className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white relative z-10" alt="" />
            
            <div className="flex-1 text-center md:text-left relative z-10">
              <h2 className="text-2xl font-black text-slate-900">{selectedSalesperson.name}</h2>
              <p className="text-amber-600 font-bold uppercase tracking-wider text-sm mt-1">{selectedSalesperson.role}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receita Total</p>
                  <p className="text-xl font-black text-slate-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(performanceData.stats.totalRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket Médio</p>
                  <p className="text-xl font-black text-slate-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(performanceData.stats.avgSale)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transações</p>
                  <p className="text-xl font-black text-slate-900">{performanceData.stats.count}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center">
              <span className="w-2 h-6 bg-amber-400 rounded-full mr-3"></span>
              Evolução das Vendas (Histórico)
            </h3>
            
            <div className="h-80 w-full">
              {performanceData.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData.chartData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 11}}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 11}}
                      tickFormatter={(val) => `R$${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), 'Receita']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorAmount)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                   <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   <p className="font-medium italic">Nenhum dado histórico para exibir ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalespersonPerformance;
