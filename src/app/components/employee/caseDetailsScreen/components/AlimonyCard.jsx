import React from 'react';
import { DollarSign, Pencil, Trash2, AlertCircle, Plus } from 'lucide-react';
import { Card } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { toast } from 'react-hot-toast';

export default function AlimonyCard({ data, setAlimonyForm, setShowAlimonyModal, setDeleteModal }) {
  return (
    <Card className="p-6 md:p-8 bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow rounded-[2rem] text-right flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4 relative z-10">
        <h4 className="font-bold text-gray-900 text-lg md:text-xl tracking-tight">تفاصيل النفقة</h4>
        {data.alimony && data.caseInfo?.status !== 'Closed' && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setAlimonyForm({
                  amount: data.alimony?.amount || '',
                  frequency: data.alimony?.frequency || 'Monthly',
                  startDate: data.alimony?.startDate ? data.alimony.startDate.split('T')[0] : '',
                  endDate: data.alimony?.endDate ? data.alimony.endDate.split('T')[0] : ''
                });
                setShowAlimonyModal(true);
              }}
              className="p-2 text-[#1e3a8a] bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors outline-none border-none"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteModal({ show: true, type: 'alimony', id: data.alimony.id, title: 'قاعدة النفقة', subtitle: 'هل أنت متأكد من حذف هذه النفقة؟' })}
              className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors outline-none border-none"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {data.alimony ? (
        <div className="grid grid-cols-1 gap-y-4 text-sm font-bold flex-1 relative z-10">
          <div className="flex justify-between items-center bg-orange-50/50 px-4 h-[76px] rounded-xl border border-orange-100 mb-4">
            <span className="text-orange-900 font-bold flex items-center gap-2"><DollarSign className="w-5 h-5 text-orange-600"/> المبلغ المقرر:</span>
            <span className="font-black text-orange-600 text-xl font-mono pl-1">{data.alimony.amount} ج.م</span>
          </div>
          <div className="flex flex-col gap-2 mt-2 relative z-10">
            <div className="flex justify-between items-center px-3 py-2.5 bg-gray-50/50 rounded-xl border border-gray-100/50">
              <span className="text-gray-500 font-bold text-xs">التكرار:</span>
              <span className="text-gray-800 text-sm font-bold">{data.alimony.frequency === 'Monthly' ? 'شهري' : (data.alimony.frequency === 'Weekly' ? 'أسبوعي' : (data.alimony.frequency === 'Daily' ? 'يومي' : 'سنوي'))}</span>
            </div>
            <div className="flex justify-between items-center px-3 py-2.5 bg-gray-50/50 rounded-xl border border-gray-100/50">
              <span className="text-gray-500 font-bold text-xs">المدة:</span>
              <span className="font-mono text-gray-800 text-sm font-bold" dir="ltr">
                {new Date(data.alimony.startDate).toLocaleDateString('ar-EG')} - {data.alimony.endDate ? new Date(data.alimony.endDate).toLocaleDateString('ar-EG') : 'غير محددة'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex-1">
          <AlertCircle className="w-6 h-6 text-gray-300 mb-3" />
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4 text-center">
            {data.caseInfo?.status === 'Closed' ? 'القضية مغلقة - للعرض فقط' : (data.custody ? 'النفقة غير محددة' : 'مطلوب تحديد الحضانة أولاً')}
          </p>
          {data.caseInfo?.status !== 'Closed' && (
            <Button
              onClick={() => {
                if (!data.custody) { toast.error("يرجى تحديد قاعدة الحضانة أولاً!"); return; }
                setAlimonyForm({ amount: '', frequency: 'Monthly', startDate: '', endDate: '' });
                setShowAlimonyModal(true);
              }}
              className={`text-xs font-bold text-white bg-[#1e3a8a] px-5 h-10 rounded-xl transition-colors shadow-sm outline-none border-none ${data.custody ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-400 cursor-not-allowed opacity-75'}`}
            >
              <Plus className="w-4 h-4 mr-1" /> إضافة نفقة
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}