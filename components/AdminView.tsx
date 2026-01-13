
import React, { useState } from 'react';
import { Store, Salesperson, StaffRole } from '../types';

interface AdminViewProps {
  stores: Store[];
  salespeople: Salesperson[];
  onUpdateStore: (store: Store) => void;
  onUpdateSalesperson: (person: Salesperson) => void;
  onAddStore: (store: Store) => void;
  onAddSalesperson: (person: Salesperson) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ 
  stores, 
  salespeople, 
  onUpdateStore, 
  onUpdateSalesperson,
  onAddStore,
  onAddSalesperson
}) => {
  const [activeTab, setActiveTab] = useState<'stores' | 'staff'>('stores');
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [editingStaff, setEditingStaff] = useState<Salesperson | null>(null);

  const roles: StaffRole[] = ['Promotor', 'Supervisor', 'Gerente'];

  const toggleStoreAssignment = (storeId: string) => {
    if (!editingStaff) return;
    const currentIds = editingStaff.storeIds || [];
    const newIds = currentIds.includes(storeId)
      ? currentIds.filter(id => id !== storeId)
      : [...currentIds, storeId];
    setEditingStaff({ ...editingStaff, storeIds: newIds });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('stores')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'stores' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Lojas
        </button>
        <button 
          onClick={() => setActiveTab('staff')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'staff' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Equipe & Metas
        </button>
      </div>

      {activeTab === 'stores' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Gerenciamento de Unidades</h3>
            <button 
              onClick={() => setEditingStore({ id: Math.random().toString(36).substr(2, 9), name: '', location: '' })}
              className="bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-amber-600 transition-all shadow-sm"
            >
              NOVA LOJA
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {stores.map(store => (
              <div key={store.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-black text-slate-900">{store.name}</h4>
                  <p className="text-xs text-slate-500 font-bold">{store.location}</p>
                </div>
                <button 
                  onClick={() => setEditingStore(store)}
                  className="text-amber-600 font-black text-[10px] uppercase hover:underline"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Promotores & Liderança</h3>
            <button 
              onClick={() => setEditingStaff({ id: Math.random().toString(36).substr(2, 9), name: '', role: 'Promotor', avatar: `https://picsum.photos/seed/${Math.random()}/200`, target: 0, storeIds: [] })}
              className="bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-amber-600 transition-all shadow-sm"
            >
              ADICIONAR MEMBRO
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {salespeople.map(person => {
              const assignedStores = stores.filter(s => person.storeIds?.includes(s.id));
              return (
                <div key={person.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img src={person.avatar} className="w-10 h-10 rounded-full border border-slate-200" alt="" />
                    <div>
                      <h4 className="font-black text-slate-900">{person.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                         <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">{person.role}</span>
                         <span className="text-[10px] font-bold text-slate-400">Meta: {person.target} Unidades</span>
                         {assignedStores.length > 0 ? assignedStores.map(as => (
                           <span key={as.id} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">📍 {as.name}</span>
                         )) : (
                           <span className="text-[10px] font-bold text-slate-300 bg-slate-50 px-2 py-0.5 rounded italic">Sem Unidade Fixa</span>
                         )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEditingStaff(person)}
                    className="text-amber-600 font-black text-[10px] uppercase hover:underline"
                  >
                    Editar / Metas
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Loja */}
      {editingStore && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-amber-500">
              <h3 className="text-slate-900 font-black uppercase tracking-widest">Configurar Unidade</h3>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Nome da Loja</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  value={editingStore.name}
                  onChange={e => setEditingStore({...editingStore, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Endereço / Localização</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  value={editingStore.location}
                  onChange={e => setEditingStore({...editingStore, location: e.target.value})}
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button onClick={() => setEditingStore(null)} className="flex-1 py-3 font-black text-xs text-slate-400 uppercase tracking-widest hover:text-slate-600">Cancelar</button>
                <button 
                  onClick={() => {
                    const exists = stores.find(s => s.id === editingStore.id);
                    exists ? onUpdateStore(editingStore) : onAddStore(editingStore);
                    setEditingStore(null);
                  }}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Equipe (Agora com suporte a múltiplas lojas) */}
      {editingStaff && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-amber-500 flex justify-between items-center">
              <h3 className="text-slate-900 font-black uppercase tracking-widest">Perfil & Atribuições</h3>
              <button onClick={() => setEditingStaff(null)} className="text-slate-900/50 hover:text-slate-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pb-2 border-b border-slate-100">Dados Gerais</h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Nome Completo</label>
                  <input 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                    value={editingStaff.name}
                    onChange={e => setEditingStaff({...editingStaff, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Cargo</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                    value={editingStaff.role}
                    onChange={e => setEditingStaff({...editingStaff, role: e.target.value as StaffRole})}
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Meta Mensal (Unidades)</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                    value={editingStaff.target}
                    onChange={e => setEditingStaff({...editingStaff, target: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              {/* Atribuição de Lojas */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] pb-2 border-b border-blue-50 flex justify-between items-center">
                   Vincular Unidades
                   <span className="bg-blue-100 px-2 py-0.5 rounded-full text-blue-600 text-[8px]">{editingStaff.storeIds?.length || 0} SELECIONADAS</span>
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {stores.map(store => {
                    const isAssigned = editingStaff.storeIds?.includes(store.id);
                    return (
                      <div 
                        key={store.id} 
                        onClick={() => toggleStoreAssignment(store.id)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                          isAssigned 
                            ? 'bg-blue-50 border-blue-500 shadow-sm' 
                            : 'bg-white border-slate-100 hover:border-blue-200'
                        }`}
                      >
                        <div>
                          <p className={`text-xs font-black ${isAssigned ? 'text-blue-900' : 'text-slate-700'}`}>{store.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold">{store.location}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                          isAssigned ? 'bg-blue-500 border-blue-500' : 'border-slate-200 group-hover:border-blue-300'
                        }`}>
                          {isAssigned && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="space-y-1 pt-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Supervisor Responsável</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                    value={editingStaff.supervisorId || ''}
                    onChange={e => setEditingStaff({...editingStaff, supervisorId: e.target.value})}
                  >
                    <option value="">Nenhum</option>
                    {salespeople.filter(p => p.role === 'Supervisor').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="md:col-span-2 flex space-x-4 pt-6 border-t border-slate-100">
                <button onClick={() => setEditingStaff(null)} className="flex-1 py-4 font-black text-xs text-slate-400 uppercase tracking-widest hover:text-slate-600">Cancelar</button>
                <button 
                  onClick={() => {
                    const exists = salespeople.find(p => p.id === editingStaff.id);
                    exists ? onUpdateSalesperson(editingStaff) : onAddSalesperson(editingStaff);
                    setEditingStaff(null);
                  }}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
