import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Download, User, Phone, MapPin } from 'lucide-react';

const Customers = ({ lang }) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from('buyers')
      .select('*')
      .order('full_name', { ascending: true });
    setCustomers(data || []);
  };

  // The CSV Export Logic
  const downloadCSV = () => {
    const headers = ["Name,Phone,Address,Created At\n"];
    const rows = customers.map(c => 
      `"${c.full_name}","${c.phone_number}","${c.address || ''}","${c.created_at}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "gold_store_customers.csv");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {lang === 'ar' ? 'قائمة العملاء' : 'Customer List'}
        </h2>
        <button 
          onClick={downloadCSV}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-md"
        >
          <Download size={18} className="mx-2" />
          {lang === 'ar' ? 'تحميل ملف CSV' : 'Download CSV'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-sm">
            <tr>
              <th className="p-4 font-semibold text-slate-700">
                <div className="flex items-center"><User size={16} className="mr-2"/> {lang === 'ar' ? 'الاسم' : 'Full Name'}</div>
              </th>
              <th className="p-4 font-semibold text-slate-700">
                <div className="flex items-center"><Phone size={16} className="mr-2"/> {lang === 'ar' ? 'الهاتف' : 'Phone Number'}</div>
              </th>
              <th className="p-4 font-semibold text-slate-700">
                <div className="flex items-center"><MapPin size={16} className="mr-2"/> {lang === 'ar' ? 'العنوان' : 'Address'}</div>
              </th>
              <th className="p-4 font-semibold text-slate-700">{lang === 'ar' ? 'تاريخ التسجيل' : 'Registered On'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-medium text-slate-900">{c.full_name}</td>
                <td className="p-4 text-slate-600 font-mono text-sm">{c.phone_number}</td>
                <td className="p-4 text-slate-500 text-sm">{c.address || '—'}</td>
                <td className="p-4 text-slate-400 text-xs">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;