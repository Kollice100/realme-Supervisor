
import React, { useMemo } from 'react';
import { Sale, Salesperson } from '../types';

interface RankingProps {
  sales: Sale[];
  salespeople: Salesperson[];
}

const Ranking: React.FC<RankingProps> = ({ sales, salespeople }) => {
  const rankedData = useMemo(() => {
    return salespeople
      .map(seller => {
        const totalRevenue = sales
          .filter(s => s.salespersonId === seller.id)
          .reduce((sum, s) => sum + s.amount, 0);
        const count = sales.filter(s => s.salespersonId === seller.id).length;
        // Agora o progresso é calculado baseado no número de unidades (vendas) realizadas
        const progress = seller.target > 0 ? (count / seller.target) * 100 : 0;
        return { ...seller, totalRevenue, count, progress };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [sales, salespeople]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Elite realme</h3>
            <p className="text-amber-500 text-xs mt-1 font-black uppercase tracking-widest">Performance e Metas de Unidades</p>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-slate-500 uppercase">Período</span>
             <p className="font-bold text-sm">Outubro 2023</p>
          </div>
        </div>
        
        <div className="p-8">
          <div className="space-y-10">
            {rankedData.map((seller, index) => (
              <div key={seller.id} className="group">
                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full font-black text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                    {index + 1}º
                  </div>

                  <div className="flex-shrink-0 relative">
                    <img src={seller.avatar} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100" alt="" />
                    {index < 3 && (
                       <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-[10px] text-slate-900 font-black shadow-lg">
                         🏆
                       </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h4 className="text-base font-black text-slate-900 truncate">{seller.name}</h4>
                        <div className="flex items-center space-x-2">
                           <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{seller.role}</span>
                           <span className="text-slate-300">•</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase">{seller.count} Unidades Vendidas</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(seller.totalRevenue)}
                        </p>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${seller.progress >= 100 ? 'text-green-500' : 'text-slate-400'}`}>
                          {seller.progress.toFixed(1)}% da Meta ({seller.count}/{seller.target})
                        </p>
                      </div>
                    </div>
                    
                    {/* Meta Bar */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          seller.progress >= 100 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(seller.progress, 100)}%` }}
                      />
                      {seller.progress > 100 && (
                        <div 
                          className="h-full bg-blue-500 animate-pulse" 
                          style={{ width: `${Math.min(seller.progress - 100, 20)}%` }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
