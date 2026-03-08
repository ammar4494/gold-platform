import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import Receipt from './Receipt'; // Import the receipt we just made
import { X, Search, ShoppingCart, Printer } from 'lucide-react';

const NewOrderModal = ({ isOpen, onClose, lang, companyName }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Receipt
  const [phone, setPhone] = useState('');
  const [buyer, setBuyer] = useState({ full_name: '', address: '' });
  const [orderData, setOrderData] = useState({ weight: '', price: '', paid: '', karat: '21' });
  const [savedOrder, setSavedOrder] = useState(null);

  if (!isOpen) return null;

  // 1. Find or Create Buyer and Save Order
  const handleFinalize = async () => {
    // A. Check if buyer exists, if not create
    let { data: existingBuyer } = await supabase.from('buyers').select('*').eq('phone_number', phone).single();
    
    if (!existingBuyer) {
      const { data: newB } = await supabase.from('buyers').insert([{ 
        full_name: buyer.full_name, 
        phone_number: phone, 
        address: buyer.address 
      }]).select().single();
      existingBuyer = newB;
    }

    // B. Save the Order
    const { data: finalOrder } = await supabase.from('orders').insert([{
      buyer_id: existingBuyer.id,
      total_price: parseFloat(orderData.price),
      paid_amount: parseFloat(orderData.paid),
      status: 'pending'
    }]).select('*, buyers(*)').single();

    setSavedOrder(finalOrder);
    setStep(2); // Move to Receipt View
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 no-print"><X size={24}/></button>

        {step === 1 ? (
          <div className="p-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <ShoppingCart className="ml-2 text-gold-500"/> {lang === 'ar' ? 'إضافة طلب جديد' : 'New Order'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buyer Info */}
              <div className="space-y-4 border-l pl-6 border-slate-100">
                <label className="block font-bold">{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                <input type="text" className="w-full p-3 border rounded" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx"/>
                
                <label className="block font-bold">{lang === 'ar' ? 'اسم العميل' : 'Buyer Name'}</label>
                <input type="text" className="w-full p-3 border rounded" value={buyer.full_name} onChange={(e) => setBuyer({...buyer, full_name: e.target.value})}/>
              </div>

              {/* Order Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold">العيار</label>
                    <select className="w-full p-3 border rounded" onChange={(e) => setOrderData({...orderData, karat: e.target.value})}>
                      <option>24K</option><option>22K</option><option selected>21K</option><option>18K</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold">الوزن (جرام)</label>
                    <input type="number" className="w-full p-3 border rounded" onChange={(e) => setOrderData({...orderData, weight: e.target.value})}/>
                  </div>
                </div>
                <label className="block font-bold text-green-700">السعر الإجمالي</label>
                <input type="number" className="w-full p-3 border-2 border-green-200 rounded text-xl font-bold" onChange={(e) => setOrderData({...orderData, price: e.target.value})}/>
                
                <label className="block font-bold text-blue-700">المبلغ المدفوع</label>
                <input type="number" className="w-full p-3 border-2 border-blue-200 rounded text-xl font-bold" onChange={(e) => setOrderData({...orderData, paid: e.target.value})}/>
              </div>
            </div>

            <button onClick={handleFinalize} className="w-full mt-8 bg-gold-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-gold-500 transition">
               {lang === 'ar' ? 'تأكيد وحفظ وطباعة الفاتورة' : 'Confirm & Print Receipt'}
            </button>
          </div>
        ) : (
          <div className="p-4">
            <Receipt order={savedOrder} companyName={companyName} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NewOrderModal;