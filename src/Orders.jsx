import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Eye, CheckCircle, Trash2, Phone } from 'lucide-react';

const Orders = ({ lang }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    // We join 'buyers' and 'users' (employees) tables to get all the info in one go
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        buyers (full_name, phone_number),
        employee:employee_id (username)
      `)
      .order('order_date', { ascending: false });

    if (data) setOrders(data);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, newStatus) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    fetchOrders();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{lang === 'ar' ? 'قائمة الطلبات' : 'Orders List'}</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-sm">
            <tr>
              <th className="p-4">{lang === 'ar' ? 'العميل' : 'Buyer'}</th>
              <th className="p-4">{lang === 'ar' ? 'التليفون' : 'Phone'}</th>
              <th className="p-4">{lang === 'ar' ? 'السعر الإجمالي' : 'Total Price'}</th>
              <th className="p-4">{lang === 'ar' ? 'المدفوع' : 'Paid'}</th>
              <th className="p-4">{lang === 'ar' ? 'المتبقي' : 'Deferred'}</th>
              <th className="p-4">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th className="p-4">{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
              <th className="p-4">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
              <th className="p-4 text-center">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer" onClick={() => console.log("Open Order Details", order.id)}>
                <td className="p-4 font-medium">{order.buyers?.full_name}</td>
                <td className="p-4 text-gray-500"><div className="flex items-center"><Phone size={14} className="mr-1"/> {order.buyers?.phone_number}</div></td>
                <td className="p-4 font-bold">${order.total_price}</td>
                <td className="p-4 text-green-600">${order.paid_amount}</td>
                <td className="p-4 text-red-600">${order.deferred_payment}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500 italic">{order.employee?.username}</td>
                <td className="p-4 text-gray-400 text-xs">
                   {new Date(order.order_date).toLocaleDateString()}
                </td>
                <td className="p-4 flex justify-center space-x-2">
                  <button onClick={(e) => {e.stopPropagation(); updateStatus(order.id, 'delivered')}} title="Mark Delivered" className="text-green-600 hover:scale-110"><CheckCircle size={18}/></button>
                  <button className="text-blue-600 hover:scale-110"><Eye size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;