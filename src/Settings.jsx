import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Save, AlertTriangle, ShieldCheck, Languages, Trash2, Lock } from 'lucide-react';

const SettingsPage = ({ lang }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState('');
  const [companyName, setCompanyName] = useState(localStorage.getItem('company_name') || 'Tiger Gold Store');

  const ADMIN_PIN = "1234"; // ⬅️ CHANGE THIS TO YOUR SECRET PIN

  const handleVerify = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAdmin(true);
    } else {
      alert(lang === 'ar' ? 'الرمز خاطئ' : 'Incorrect PIN');
      setPin('');
    }
  };

  // If not verified, show the Lock Screen
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center max-w-sm w-full">
          <Lock size={48} className="mx-auto text-gold-500 mb-4" />
          <h2 className="text-xl font-bold mb-4">{lang === 'ar' ? 'دخول المسؤول' : 'Admin Access'}</h2>
          <form onSubmit={handleVerify}>
            <input 
              type="password" 
              placeholder="****"
              className="w-full p-3 border rounded-lg text-center text-2xl tracking-widest mb-4"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
            />
            <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold">
              {lang === 'ar' ? 'دخول' : 'Enter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If verified, show the actual settings
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center">
          <ShieldCheck className="mr-3 text-gold-500" />
          {lang === 'ar' ? 'إعدادات النظام' : 'System Settings'}
        </h2>
        <button onClick={() => setIsAdmin(false)} className="text-sm text-slate-500 underline">
          {lang === 'ar' ? 'خروج' : 'Logout'}
        </button>
      </div>

      {/* Company Name Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <label className="block text-sm font-medium text-slate-600 mb-2">{lang === 'ar' ? 'اسم الشركة' : 'Company Name'}</label>
        <div className="flex gap-4">
          <input 
            type="text" 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="flex-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gold-500"
          />
          <button 
            onClick={() => { localStorage.setItem('company_name', companyName); alert('Saved!'); }}
            className="bg-gold-600 text-white px-6 rounded-lg font-bold hover:bg-gold-500"
          >
            {lang === 'ar' ? 'حفظ' : 'Save'}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 p-8 rounded-xl border border-red-200">
        <h3 className="text-lg font-bold text-red-800 flex items-center">
          <AlertTriangle className="mr-2" /> {lang === 'ar' ? 'منطقة الخطر' : 'Danger Zone'}
        </h3>
        <p className="text-red-600 text-sm mt-2">
          {lang === 'ar' ? 'سيتم مسح كافة البيانات بشكل نهائي' : 'All data will be permanently deleted.'}
        </p>
        <button 
          onClick={async () => {
            if(confirm(lang === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?')) {
               // Add Supabase delete logic here
               alert('Platform Reset');
            }
          }}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          {lang === 'ar' ? 'مسح كافة البيانات' : 'Reset All Data'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;