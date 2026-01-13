
import React, { useState, useMemo, useEffect } from 'react';
import { Sale, Salesperson, Store } from '../types';
import { INITIAL_STORES } from '../constants';

interface SalesListProps {
  sales: Sale[];
  salespeople: Salesperson[];
  onAddSale: (sale: Sale) => void;
}

type FilterType = 'all' | 'week' | 'month' | 'custom';

const SalesList: React.FC<SalesListProps> = ({ sales, salespeople, onAddSale }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  
  const [formData, setFormData] = useState({
    salespersonId: salespeople[0]?.id || '',
    storeId: '',
    amount: '',
    product: '',
    customer: '',
  });

  // Get available stores for the selected promoter
  const availableStores = useMemo(() => {
    const selectedPromotor = salespeople.find(p => p.id === formData.salespersonId);
    if (!selectedPromotor) return INITIAL_STORES;
    
    // If promotor has fixed stores, only show those
    if (selectedPromotor.storeIds && selectedPromotor.storeIds.length > 0) {
      return INITIAL_STORES.filter(s => selectedPromotor.storeIds.includes(s.id));
    }
    
    // If no stores linked, show all (floating)
    return INITIAL_STORES;
  }, [formData.salespersonId, salespeople]);

  // Effect to handle storeId when promotor changes
  useEffect(() => {
    if (isAdding) {
      // If current selected store is not in the new available list, pick the first one
      if (availableStores.length > 0 && !availableStores.find(s => s.id === formData.storeId)) {
        setFormData(prev => ({ ...prev, storeId: availableStores[0].id }));
      }
    }
  }, [availableStores, isAdding]);

  const filteredSales = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return sales.filter(sale => {
      const saleDate = new Date(sale.date);

      if (filterType === 'all') return true;

      if (filterType === 'week') {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        return saleDate >= lastWeek;
      }

      if (filterType === 'month') {
        return (
          saleDate.getMonth() === today.getMonth() &&
          saleDate.getFullYear() === today.getFullYear()
        );
      }

      if (filterType === 'custom') {
        if (!customStart && !customEnd) return true;
        const start = customStart ? new Date(customStart) : new Date(0);
        const end = customEnd ? new Date(customEnd) : new Date();
        end.setHours(23, 59, 59, 999);
        return saleDate >= start && saleDate <= end;
      }

      return true;
    });
  }, [sales, filterType, customStart, customEnd]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.product || !formData.customer || !formData.storeId) return;

    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      salespersonId: formData.salespersonId,
      storeId: formData.storeId,
      amount: parseFloat(formData.amount),
      product: formData.product,
      customer: formData.customer,
      date: new Date().toISOString().split('T')[0],
    };

    onAddSale(newSale);
    setIsAdding(false);
    setFormData({
      salespersonId: salespeople[0]?.id || '',
      storeId: availableStores[0]?.id || '',
      amount: '',
      product: '',
      customer: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900">Registro de Vendas</h3>
          <p className="text-sm text-slate-500 font-bold">Histórico detalhado de transações</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-6 py-2 bg-amber-500 text-slate-900 rounded-xl text-sm font-black hover:bg-amber-600 transition-all shadow-md active:scale-95 flex items-center justify-center"
        >
          {isAdding ? 'Cancelar' : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Nova Venda
            </>
          )}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xl animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Promotor</label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.salespersonId}
                onChange={(e) => setFormData({...formData, salespersonId: e.target.value})}
              >
                {salespeople.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                Unidade da Venda
                {salespeople.find(p => p.id === formData.salespersonId)?.storeIds?.length === 1 && (
                   <span className="ml-2 text-[8px] bg-blue-100 text-blue-600 px-1 rounded">ÚNICA OPÇÃO</span>
                )}
                {salespeople.find(p => p.id === formData.salespersonId)?.storeIds?.length > 1 && (
                   <span className="ml-2 text-[8px] bg-amber-100 text-amber-600 px-1 rounded">MÚLTIPLAS UNIDADES</span>
                )}
              </label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.storeId}
                onChange={(e) => setFormData({...formData, storeId: e.target.value})}
              >
                {availableStores.length > 0 ? availableStores.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                )) : (
                  <option value="" disabled>Nenhuma unidade disponível</option>
                )}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</label>
              <input 
                type="text" 
                placeholder="Ex: Consultoria" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</label>
              <input 
                type="text" 
                placeholder="Ex: Acme Inc" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.customer}
                onChange={(e) => setFormData({...formData, customer: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor (R$)</label>
              <input 
                type="number" 
                placeholder="0,00" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
             <button type="submit" className="bg-amber-500 text-slate-900 px-10 py-3 rounded-xl font-black text-sm hover:bg-amber-600 transition-all shadow-lg active:scale-95">
               Confirmar Venda
             </button>
          </div>
        </form>
      )}

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase mr-2 tracking-widest">Filtro Temporal:</span>
          {[
            { id: 'all', label: 'Tudo' },
            { id: 'week', label: 'Semana' },
            { id: 'month', label: 'Mês' },
            { id: 'custom', label: 'Personalizado' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilterType(opt.id as FilterType)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${
                filterType === opt.id 
                  ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {filterType === 'custom' && (
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-50 animate-in fade-in slide-in-from-left-2">
            <div className="flex items-center space-x-2">
              <label className="text-[10px] font-black text-slate-400 uppercase">De:</label>
              <input 
                type="date" 
                className="px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-[10px] font-black text-slate-400 uppercase">Até:</label>
              <input 
                type="date" 
                className="px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        {filteredSales.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-amber-50/30 border-b border-amber-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Promotor</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.slice().reverse().map((sale) => {
                const seller = salespeople.find(s => s.id === sale.salespersonId);
                const store = INITIAL_STORES.find(s => s.id === sale.storeId);
                return (
                  <tr key={sale.id} className="hover:bg-amber-50/10 transition-colors group">
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">{sale.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={seller?.avatar} className="w-7 h-7 rounded-full ring-2 ring-white shadow-sm" alt="" />
                        <span className="text-sm font-bold text-slate-900">{seller?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                        {store?.name || 'Geral'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{sale.customer}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600">
                        {sale.product}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-900 text-right whitespace-nowrap">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-400 italic">
            Nenhuma venda registrada para este filtro.
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesList;
