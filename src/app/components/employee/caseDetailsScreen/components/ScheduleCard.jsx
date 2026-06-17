import React from 'react';
import { MapPin, Clock, Pencil, Trash2, AlertCircle, Plus } from 'lucide-react';
import { Card } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { formatTime12h } from './CaseHelpers';
import { toast } from 'react-hot-toast';

export default function ScheduleCard({ data, locationCache, setScheduleForm, setShowScheduleModal, setDeleteModal }) {
  return (
    <Card className="p-6 md:p-8 bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow rounded-[2rem] text-right flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4 relative z-10">
        <h4 className="font-bold text-gray-900 text-lg md:text-xl tracking-tight">جدول الزيارات</h4>
        {data.schedule && data.caseInfo?.status !== 'Closed' && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setScheduleForm({
                  locationId: data.schedule?.visitCenterId || '',
                  frequency: data.schedule?.frequency || 'Weekly',
                  startDate: data.schedule?.startDate ? data.schedule.startDate.split('T')[0] : '',
                  endDate: data.schedule?.endDate ? data.schedule.endDate.split('T')[0] : '',
                  startTime: data.schedule?.startTime || '',
                  endTime: data.schedule?.endTime || ''
                });
                setShowScheduleModal(true);
              }}
              className="p-2 text-[#1e3a8a] bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors outline-none border-none"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteModal({ show: true, type: 'schedule', id: data.schedule.id, title: 'جدول الزيارات', subtitle: 'هل أنت متأكد من حذف هذا الجدول؟' })}
              className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors outline-none border-none"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {data.schedule ? (
        <div className="grid grid-cols-1 gap-y-4 text-sm font-bold flex-1 relative z-10">
          <div className="flex justify-between items-center bg-indigo-50/50 px-4 h-[76px] rounded-xl border border-indigo-100 mb-4">
            <span className="text-indigo-900 font-bold flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-600"/> الموقع:</span>
            <span className="font-black text-indigo-700 text-lg truncate max-w-[160px] pl-1">{locationCache[data.schedule.visitCenterId] || 'غير معروف'}</span>
          </div>
          <div className="flex flex-col gap-2 mt-2 relative z-10">
            <div className="flex justify-between items-center px-3 py-2.5 bg-gray-50/50 rounded-xl border border-gray-100/50">
              <span className="text-gray-500 font-bold text-xs">التكرار:</span>
              <span className="text-gray-800 text-sm font-bold">{data.schedule.frequency === 'Weekly' ? 'أسبوعي' : (data.schedule.frequency === 'Daily' ? 'يومي' : 'شهري')}</span>
            </div>
            <div className="flex justify-between items-center px-3 py-2.5 bg-gray-50/50 rounded-xl border border-gray-100/50">
              <span className="text-gray-500 font-bold text-xs">المدة:</span>
              <span className="font-mono text-gray-800 text-sm font-bold" dir="ltr">
                {new Date(data.schedule.startDate).toLocaleDateString('ar-EG')} - {data.schedule.endDate ? new Date(data.schedule.endDate).toLocaleDateString('ar-EG') : 'غير محددة'}
              </span>
            </div>
            <div className="flex justify-between items-center px-3 py-2.5 bg-gray-50/50 rounded-xl border border-gray-100/50">
              <span className="text-gray-500 font-bold text-xs">الفترة:</span>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 font-mono text-xs flex items-center gap-1" dir="ltr">
                <Clock className="w-3.5 h-3.5" />
                {formatTime12h(data.schedule.startTime)} - {formatTime12h(data.schedule.endTime)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex-1">
          <AlertCircle className="w-6 h-6 text-gray-300 mb-3" />
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4 text-center">
            {data.caseInfo?.status === 'Closed' ? 'القضية مغلقة - للعرض فقط' : (data.custody ? 'الجدول غير محدد' : 'مطلوب تحديد الحضانة أولاً')}
          </p>
          {data.caseInfo?.status !== 'Closed' && (
            <Button
              onClick={() => {
                if (!data.custody) { toast.error("يرجى تحديد قاعدة الحضانة أولاً!"); return; }
                setScheduleForm({ locationId: '', frequency: 'Weekly', startDate: '', endDate: '', startTime: '', endTime: '' });
                setShowScheduleModal(true);
              }}
              className={`text-xs font-bold text-white px-5 h-10 rounded-xl transition-colors shadow-sm outline-none border-none ${data.custody ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed opacity-75'}`}
            >
              <Plus className="w-4 h-4 mr-1" /> إضافة جدول
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}