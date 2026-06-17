import React from 'react';
import { User, Pencil, Trash2, ChevronDown, AlertCircle, Plus } from 'lucide-react';
import { Card } from '../../../ui/card';
import { Button } from '../../../ui/button';

export default function CustodyCard({ data, father, mother, showParentName, setShowParentName, setCustodyForm, setShowCustodyModal, setDeleteModal }) {
  return (
    <Card className="p-6 md:p-8 bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow rounded-[2rem] text-right flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4 relative z-10">
        <h4 className="font-bold text-gray-900 text-lg md:text-xl tracking-tight">تفاصيل الحضانة</h4>
        {data.custody && data.caseInfo?.status !== 'Closed' && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCustodyForm({
                  custodialParentId: data.custody?.custodialParentId || '',
                  startAt: data.custody?.startAt ? data.custody.startAt.split('T')[0] : '',
                  endAt: data.custody?.endAt ? data.custody.endAt.split('T')[0] : ''
                });
                setShowCustodyModal(true);
              }}
              className="p-2 text-[#1e3a8a] bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors outline-none border-none"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteModal({ show: true, type: 'custody', id: data.custody.id, title: 'قاعدة الحضانة', subtitle: 'سيتم حذف القاعدة بشكل نهائي.' })}
              className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors outline-none border-none"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {data.custody ? (
        <div className="grid grid-cols-1 gap-y-4 text-sm font-bold flex-1 relative z-10">
          <div className="flex justify-between items-center bg-blue-50/50 px-4 h-[76px] rounded-xl border border-blue-100 mb-4">
            <span className="text-blue-900 font-bold flex items-center gap-2"><User className="w-5 h-5 text-blue-600"/> الوالد الحاضن:</span>
            <div className="relative flex flex-col items-end" id="parent-name-toggle">
              <button
                type="button"
                onClick={() => setShowParentName(!showParentName)}
                className="flex items-center gap-1.5 font-black text-blue-700 text-lg hover:bg-blue-100/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-none outline-none"
              >
                {data.custody.custodialParentId === father?.id ? 'الأب' : 'الأم'}
                <ChevronDown className={`w-4 h-4 transition-transform ${showParentName ? 'rotate-180' : ''}`} />
              </button>
              {showParentName && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-max max-w-[220px] bg-white border border-blue-100 shadow-[0_10px_40px_rgba(30,58,138,0.15)] rounded-xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 text-right">
                  <p className="text-[10px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">الاسم بالكامل</p>
                  <p className="text-sm text-blue-900 font-bold leading-relaxed">
                    {data.custody.custodialParentId === father?.id ? father?.fullName : mother?.fullName}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2 relative z-10">
            <div className="flex justify-between items-center px-3 py-2.5 bg-gray-50/50 rounded-xl border border-gray-100/50">
              <span className="text-gray-500 font-bold text-xs">المدة:</span>
              <span className="font-mono text-gray-800 text-sm font-bold" dir="ltr">
                {new Date(data.custody.startAt).toLocaleDateString('ar-EG')} - {data.custody.endAt ? new Date(data.custody.endAt).toLocaleDateString('ar-EG') : 'غير محددة'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex-1">
          <AlertCircle className="w-6 h-6 text-gray-300 mb-3" />
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4 text-center">
            {data.caseInfo?.status === 'Closed' ? 'القضية مغلقة - للعرض فقط' : 'مطلوب تحديد قاعدة الحضانة'}
          </p>
          {data.caseInfo?.status !== 'Closed' && (
            <Button
              onClick={() => {
                setCustodyForm({ custodialParentId: '', startAt: '', endAt: '' });
                setShowCustodyModal(true);
              }}
              className="text-xs font-bold text-white bg-[#1e3a8a] px-5 h-10 rounded-xl hover:bg-blue-800 transition-colors shadow-sm outline-none border-none"
            >
              <Plus className="w-4 h-4 mr-1" /> إضافة حضانة
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}