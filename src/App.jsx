import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// We use "as SettingsIcon" to prevent a name clash with the Settings page component
import { LayoutDashboard, ShoppingCart, Users, Settings as SettingsIcon, Database, Plus } from 'lucide-react';

// Import your pages
import Customers from './Customers';
import Orders from './Orders'; 
import Catalog from './Catalog';
import SettingsPage from './Settings'; 
import NewOrderModal from './NewOrderModal';

const App = () => {
  const [lang, setLang] = useState('en'); // 'en' or 'ar'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const translations = {
    en: { 
      dashboard: "Dashboard", 
      catalog: "Catalog", 
      orders: "Orders", 
      customers: "Customers", 
      settings: "Settings", 
      newSale: "New Sale" 
    },
    ar: { 
      dashboard: "لوحة التحكم", 
      catalog: "الكتالوج", 
      orders: "الطلبات", 
      customers: "العملاء", 
      settings: "الإعدادات", 
      newSale: "عملية بيع جديدة" 
    }
  };

  const t = translations[lang];

  return (
    <Router>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="flex min-h-screen bg-gray-100 font-sans">
        
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-xl">
          <div className="p-6 text-2xl font-bold border-b border-slate-700 text-yellow-500 text-center">GoldStore</div>
          
          {/* NEW SALE BUTTON */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="m-4 p-3 bg-yellow-600 text-slate-900 rounded-lg font-bold flex items-center justify-center hover:bg-yellow-500 transition shadow-lg"
          >
            <Plus size={20} className="mx-2"/> {t.newSale}
          </button>

          <nav className="flex-1">
            <Link to="/" className="flex items-center p-4 hover:bg-slate-800 transition-colors">
              <LayoutDashboard className="mx-2" size={20}/> {t.dashboard}
            </Link>
            <Link to="/catalog" className="flex items-center p-4 hover:bg-slate-800 transition-colors">
              <Database className="mx-2" size={20}/> {t.catalog}
            </Link>
            <Link to="/orders" className="flex items-center p-4 hover:bg-slate-800 transition-colors">
              <ShoppingCart className="mx-2" size={20}/> {t.orders}
            </Link>
            <Link to="/customers" className="flex items-center p-4 hover:bg-slate-800 transition-colors">
              <Users className="mx-2" size={20}/> {t.customers}
            </Link>
          </nav>
          
          <div className="p-4 border-t border-slate-700">
             <Link to="/settings" className="flex items-center p-4 hover:bg-slate-800 mb-2 rounded">
               <SettingsIcon className="mx-2" size={20}/> {t.settings}
             </Link>
             <button 
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="w-full p-2 bg-slate-700 rounded font-bold hover:bg-slate-600 transition"
              >
                {lang === 'en' ? 'العربية' : 'English'}
              </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className={`${lang === 'en' ? 'ml-64' : 'mr-64'} flex-1 p-8 min-h-screen`}>
          <Routes>
            <Route path="/" element={<h1 className="text-3xl font-bold">{t.dashboard}</h1>} />
            <Route path="/catalog" element={<Catalog lang={lang} />} />
            <Route path="/orders" element={<Orders lang={lang} />} />
            <Route path="/customers" element={<Customers lang={lang} />} />
            <Route path="/settings" element={<SettingsPage lang={lang} />} />
          </Routes>
        </main>

        {/* Modal Logic */}
        <NewOrderModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          lang={lang} 
          companyName={localStorage.getItem('company_name') || "Tiger Gold Store"} 
        />
      </div>
    </Router>
  );
};

export default App;