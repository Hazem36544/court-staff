import React from 'react';
import { Clock, MapPin, DollarSign } from 'lucide-react';
import { Card } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { formatTime12h } from './CaseHelpers';

export default function HistorySections({ 
  visitations, paymentsDue, locationCache, selectedPaymentDue, handleFetchPaymentAttempts,
  setSelectedHistoryVisit, setShowHistoryDetailsModal // ✅ استقبال الدوال الجديدة
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      {/* Visitation History */}
      <Card className="p-0 overflow-hidden bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[2rem] text-right">
        <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/30">
          <h3 className="font-bold text-xl flex items-center gap-3"><Clock className="text-blue-600 w-6 h-6" /> سجل الزيارات</h3>
        </div>
        <div className="p-6 bg-white space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
          {visitations.length > 0 ? visitations.map((v, i) => (
            <div 
               key={v.id || i} 
               onClick={() => { setSelectedHistoryVisit(v); setShowHistoryDetailsModal(true); }}
               className="p-6 bg-gray-50/50 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
                <span className="font-black text-gray-900 text-lg font-mono tracking-wider group-hover:text-blue-800 transition-colors">{new Date(v.startAt).toLocaleDateString('ar-EG')}</span>
                <Badge className={`${v.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'} border-none shadow-sm text-xs px-4 py-1.5 rounded-full font-bold`}>{v.status === 'Completed' ? 'مكتملة' : 'مجدولة'}</Badge>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white px-4 py-3 rounded-xl border border-gray-100 group-hover:border-blue-100 transition-colors">
                  <span className="text-gray-500 flex items-center gap-2 text-xs font-bold">
                    <MapPin className="w-4 h-4 text-blue-500" /> الموقع:
                  </span>
                  <span className="text-gray-800 text-sm font-bold truncate max-w-[200px]">
                    {locationCache[v.visitCenterId] || v.locationName || 'موقع غير معروف'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 px-1">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-500 text-[10px] uppercase tracking-widest">المرافق البديل</span>
                    <span className="text-gray-900 font-mono font-bold text-sm tracking-wider" dir="ltr">{v.companionNationalId || '---'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-500 text-[10px] uppercase tracking-widest">الزائر</span>
                    <span className="text-gray-900 font-mono font-bold text-sm tracking-wider" dir="ltr">{v.nonCustodialNationalId || '---'}</span>
                  </div>
                </div>
                <div className="flex justify-center items-center gap-2 text-blue-800 bg-blue-50/50 border border-blue-100 py-2.5 rounded-xl mt-2 px-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-bold font-mono text-xs tracking-wider" dir="ltr">{formatTime12h(v.startAt.split('T')[1])} - {formatTime12h(v.endAt.split('T')[1])}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-[1.5rem] bg-gray-50">
               <Clock className="w-12 h-12 mb-3 opacity-20" />
               <p className="font-bold">لا يوجد سجل زيارات لهذه القضية.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Payments Due History */}
      <Card className="p-0 overflow-hidden bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[2rem] text-right">
        <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/30" dir="rtl">
          <h3 className="font-bold text-xl flex items-center gap-3"><DollarSign className="text-orange-600 w-6 h-6" /> سجل الدفعات المستحقة</h3>
        </div>
        <div className="p-6 bg-white space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
          {paymentsDue.length > 0 ? paymentsDue.map((pd, i) => (
            <div key={pd.id || i} className="p-6 bg-gray-50/50 rounded-[1.5rem] border border-gray-100 shadow-sm transition-all">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <span className="font-black text-gray-900 text-xl tracking-tight font-mono">{pd.amount} ج.م</span>
                <Badge className={`${pd.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border-none shadow-sm text-xs px-4 py-1.5 rounded-full font-bold`}>
                  {pd.status === 'Paid' ? 'مدفوعة' : 'غير مدفوعة'}
                </Badge>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">تاريخ الاستحقاق</span>
                  <span className="text-sm text-gray-800 font-mono font-bold tracking-wider" dir="ltr">{new Date(pd.dueDate).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-[1.5rem] bg-gray-50">
               <DollarSign className="w-12 h-12 mb-3 opacity-20" />
               <p className="font-bold">لا يوجد دفعات مستحقة مسجلة.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}