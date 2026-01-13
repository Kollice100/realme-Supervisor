
import React, { useMemo } from 'react';
import { Sale, Salesperson } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  sales: Sale[];
  salespeople: Salesperson[];
}

const Dashboard: React.FC<DashboardProps> = ({ sales, salespeople }) => {
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0);
    const avgTicket = sales.length ? totalRevenue / sales.length : 0;
    const totalTransactions = sales.length;
    
    // Revenue by Salesperson for the chart
    const revenueBySeller = salespeople.map(seller => {
      const amount = sales
        .filter(s => s.salespersonId === seller.id)
        .reduce((sum, s) => sum + s.amount, 0);
      return {
        name: seller.name.split(' ')[0],
        total: amount
      };
    }).sort((a, b) => b.total - a.total);

    return { totalRevenue, avgTicket, totalTransactions, revenueBySeller };
  }, [sales, salespeople]);

  // Sunshower Palette: Ambers, Yellows, and Warm Oranges
  const COLORS = ['#f59e0b', '#fbbf24', '#fb923c', '#facc15', '#ea580c'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-t-4 border-t-amber-400">
          <p className="text-slate-500 text-sm font-medium mb-1">Receita Total</p>
          <h3 className="text-2xl font-bold text-slate-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalRevenue)}
          </h3>
          <div className="mt-2 text-xs text-green-600 flex items-center font-medium">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            +12.5% em relação ao mês anterior
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-t-4 border-t-yellow-400">
          <p className="text-slate-500 text-sm font-medium mb-1">Ticket Médio</p>
          <h3 className="text-2xl font-bold text-slate-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.avgTicket)}
          </h3>
          <div className="mt-2 text-xs text-slate-400 flex items-center font-medium">
            Baseado em {stats.totalTransactions} vendas
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-t-4 border-t-orange-400">
          <p className="text-slate-500 text-sm font-medium mb-1">Vendas Concluídas</p>
          <h3 className="text-2xl font-bold text-slate-900">{stats.totalTransactions}</h3>
          <div className="mt-2 text-xs text-amber-600 font-medium">
            Faltam 5 para a meta semanal
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
          <span className="w-2 h-6 bg-amber-500 rounded-full mr-3"></span>
          Receita por Promotor
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.revenueBySeller}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val}`} />
              <Tooltip 
                cursor={{fill: '#fef3c7'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), 'Total']}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {stats.revenueBySeller.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Últimas Vendas</h3>
        <div className="divide-y divide-slate-100">
          {sales.slice(-4).reverse().map((sale) => (
            <div key={sale.id} className="py-3 flex items-center justify-between hover:bg-amber-50/30 px-2 rounded-lg transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-900">{sale.product}</p>
                <p className="text-xs text-slate-500">{sale.customer}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-amber-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.amount)}
                </p>
                <p className="text-xs text-slate-400">{sale.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
