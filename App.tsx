
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Ranking from './components/Ranking';
import SalesList from './components/SalesList';
import AIInsights from './components/AIInsights';
import SalespersonPerformance from './components/SalespersonPerformance';
import StoreAnalysis from './components/StoreAnalysis';
import AdminView from './components/AdminView';
import { Sale, Salesperson, Store, ViewState } from './types';
import { INITIAL_SALES, INITIAL_SALESPERSONS, INITIAL_STORES } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  
  // Sales State
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('sales_data');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  // Salespeople State
  const [salespeople, setSalespeople] = useState<Salesperson[]>(() => {
    const saved = localStorage.getItem('staff_data');
    return saved ? JSON.parse(saved) : INITIAL_SALESPERSONS;
  });

  // Stores State
  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem('stores_data');
    return saved ? JSON.parse(saved) : INITIAL_STORES;
  });

  useEffect(() => {
    localStorage.setItem('sales_data', JSON.stringify(sales));
    localStorage.setItem('staff_data', JSON.stringify(salespeople));
    localStorage.setItem('stores_data', JSON.stringify(stores));
  }, [sales, salespeople, stores]);

  const handleAddSale = (newSale: Sale) => setSales(prev => [...prev, newSale]);

  const handleUpdateStore = (updatedStore: Store) => {
    setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s));
  };

  const handleAddStore = (newStore: Store) => setStores(prev => [...prev, newStore]);

  const handleUpdateSalesperson = (updatedPerson: Salesperson) => {
    setSalespeople(prev => prev.map(p => p.id === updatedPerson.id ? updatedPerson : p));
  };

  const handleAddSalesperson = (newPerson: Salesperson) => setSalespeople(prev => [...prev, newPerson]);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard sales={sales} salespeople={salespeople} />;
      case 'ranking':
        return <Ranking sales={sales} salespeople={salespeople} />;
      case 'sales':
        return <SalesList sales={sales} salespeople={salespeople} onAddSale={handleAddSale} />;
      case 'stores':
        return <StoreAnalysis sales={sales} />;
      case 'admin':
        return (
          <AdminView 
            stores={stores} 
            salespeople={salespeople} 
            onUpdateStore={handleUpdateStore}
            onAddStore={handleAddStore}
            onUpdateSalesperson={handleUpdateSalesperson}
            onAddSalesperson={handleAddSalesperson}
          />
        );
      case 'performance':
        return <SalespersonPerformance sales={sales} salespeople={salespeople} />;
      case 'ai-insights':
        return <AIInsights sales={sales} salespeople={salespeople} />;
      default:
        return <Dashboard sales={sales} salespeople={salespeople} />;
    }
  };

  return (
    <Layout activeView={view} onNavigate={setView}>
      {renderView()}
    </Layout>
  );
};

export default App;
