
import React, { useState } from 'react';
import { Sale, Salesperson, SalesInsight } from '../types';
import { getSalesInsights } from '../services/geminiService';

interface AIInsightsProps {
  sales: Sale[];
  salespeople: Salesperson[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ sales, salespeople }) => {
  const [insight, setInsight] = useState<SalesInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const result = await getSalesInsights(sales, salespeople);
      setInsight(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-amber-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-yellow-100/50 rounded-full blur-3xl"></div>
        
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10">
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h3 className="text-xl font-black text-slate-900 relative z-10">Visão do Sol (IA Insights)</h3>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto relative z-10">
          Obtenha uma análise profunda e estratégica da sua performance com o poder da inteligência artificial.
        </p>
        <button 
          onClick={generateReport}
          disabled={loading}
          className={`mt-6 px-10 py-3 rounded-xl font-black tracking-wide transition-all shadow-xl relative z-10 ${
            loading 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-amber-500 text-slate-900 hover:bg-amber-600 hover:shadow-amber-400/30 active:scale-95'
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Iluminando dados...
            </span>
          ) : 'Gerar Relatório Estratégico'}
        </button>
      </div>

      {insight && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Resumo Executivo</h4>
            <p className="text-slate-700 leading-relaxed text-sm font-medium">{insight.summary}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Tendências do Mercado</h4>
            <p className="text-slate-700 leading-relaxed text-sm font-medium">{insight.trendAnalysis}</p>
          </div>

          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 shadow-sm group">
            <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
              Brilho Máximo (Destaques)
            </h4>
            <p className="text-amber-900 leading-relaxed text-sm font-bold">{insight.topPerformerAdvice}</p>
          </div>

          <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm group">
            <h4 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Caminho para o Sucesso
            </h4>
            <p className="text-orange-900 leading-relaxed text-sm font-bold">{insight.lowPerformerAdvice}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
