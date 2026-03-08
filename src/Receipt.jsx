import React from 'react';

const Receipt = ({ order, companyName }) => {
  if (!order) return null;

  return (
    <div className="print-area bg-white p-8 max-w-[210mm] mx-auto my-10 border shadow-lg print:shadow-none print:border-none print:my-0" dir="rtl">
      {/* Header */}
      <div className="text-center border-b-2 border-slate-900 pb-6 mb-6">
        <h1 className="text-4xl font-bold mb-2">{companyName || "متجر النمر للذهب"}</h1>
        <p className="text-xl">فاتورة بيع ذهب</p>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-2 gap-8 mb-8 text-lg">
        <div className="text-right">
          <p><strong>رقم الفاتورة:</strong> #{order.id?.slice(0, 8)}</p>
          <p><strong>التاريخ:</strong> {new Date().toLocaleDateString('ar-EG')}</p>
          <p><strong>الوقت:</strong> {new Date().toLocaleTimeString('ar-EG')}</p>
        </div>
        <div className="text-left">
          <p><strong>العميل:</strong> {order.buyers?.full_name}</p>
          <p><strong>الهاتف:</strong> {order.buyers?.phone_number}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse border border-slate-400 mb-8 text-right">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-400 p-3">الصنف</th>
            <th className="border border-slate-400 p-3">العيار</th>
            <th className="border border-slate-400 p-3">الوزن (جرام)</th>
            <th className="border border-slate-400 p-3">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-lg">
            <td className="border border-slate-400 p-3">ذهب مشغول</td>
            <td className="border border-slate-400 p-3">21K</td>
            <td className="border border-slate-400 p-3">{order.total_weight || '0.00'} ج</td>
            <td className="border border-slate-400 p-3">{order.total_price} ج.م</td>
          </tr>
        </tbody>
      </table>

      {/* Financial Totals */}
      <div className="w-1/2 mr-auto space-y-2 text-xl border-t-2 border-slate-900 pt-4">
        <div className="flex justify-between font-bold">
          <span>الإجمالي الكلي:</span>
          <span>{order.total_price} ج.م</span>
        </div>
        <div className="flex justify-between text-green-700 font-semibold">
          <span>المبلغ المدفوع:</span>
          <span>{order.paid_amount} ج.م</span>
        </div>
        <div className="flex justify-between text-red-700 border-t border-slate-200 pt-2 font-bold">
          <span>المتبقي (آجل):</span>
          <span>{order.deferred_payment} ج.م</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 text-center border-t border-dashed border-slate-400 pt-6">
        <p className="text-sm italic">شكراً لتعاملكم مع {companyName || "متجرنا"}</p>
        <button 
          onClick={() => window.print()} 
          className="mt-4 no-print bg-slate-900 text-white px-8 py-2 rounded-lg"
        >
          اضغط للطباعة
        </button>
      </div>
    </div>
  );
};

export default Receipt;