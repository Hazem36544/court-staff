import React from 'react';
import { XCircle, Info, User, Calendar, Clock, FileEdit } from 'lucide-react';
import { Button } from '../../../ui/button';
import { getStatusBadge, getStatusIcon, getStatusText } from './RequestsHelpers';

export default function RequestDetailsModal({ selectedRequest, setSelectedRequest }) {
  if (!selectedRequest) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" dir="rtl">
      <div className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-right rounded-[2rem] shadow-2xl flex flex-col custom-scrollbar">
        
        <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="bg-[#1e3a8a]/10 p-2.5 rounded-xl shrink-0">
              <Info className="w-5 h-5 md:w-6 md:h-6 text-[#1e3a8a]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800">تفاصيل الطلب</h2>
              <p className="text-xs text-gray-500 font-bold mt-1">معرف: <span className="font-mono text-[10px] tracking-wider">{selectedRequest.id.split('-')[0]}</span></p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedRequest(null)} 
            className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800 outline-none cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 md:p-6 space-y-6 flex-1">
          
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-500 font-bold text-xs">مقدم الطلب</span>
                <span className="font-bold text-gray-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#1e3a8a]" /> {selectedRequest.parentName}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-500 font-bold text-xs">تاريخ التقديم</span>
                <span className="font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1e3a8a]" /> {selectedRequest.requestDate}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-500 font-bold text-xs">الحالة النهائية</span>
                <span className={`inline-flex w-max items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${getStatusBadge(selectedRequest.status)}`}>
                  {getStatusIcon(selectedRequest.status)} {getStatusText(selectedRequest.status)}
                </span>
              </div>
              {selectedRequest.processedAt && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-gray-500 font-bold text-xs">تاريخ الرد على الطلب</span>
                  <span className="font-bold text-gray-800 flex items-center gap-2 font-mono">
                    <Clock className="w-4 h-4 text-[#1e3a8a]" /> {selectedRequest.processedAt}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4 text-sm flex items-center gap-2 px-1">
              <FileEdit className="w-4 h-4 text-[#1e3a8a]" /> المواعيد المقترحة والمبررات
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between sm:block">
                <p className="text-xs text-blue-600 font-bold mb-1">من تاريخ:</p>
                <p className="text-sm font-bold text-blue-900 font-mono tracking-wider">{selectedRequest.startDate || 'غير محدد'}</p>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between sm:block">
                <p className="text-xs text-blue-600 font-bold mb-1">إلى تاريخ:</p>
                <p className="text-sm font-bold text-blue-900 font-mono tracking-wider">{selectedRequest.endDate || 'غير محدد'}</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-4 left-4 text-gray-100 pointer-events-none">
                <FileEdit className="w-12 h-12 opacity-40" />
              </div>
              <p className="text-xs text-gray-500 font-bold mb-2">السبب المسجل للطلب:</p>
              <p className="text-sm font-bold text-gray-800 leading-relaxed whitespace-pre-wrap relative z-10">
                {selectedRequest.reason || 'لا توجد أسباب مسجلة لهذا الطلب.'}
              </p>
            </div>
          </div>

          {selectedRequest.status !== 'pending' && selectedRequest.decisionNote && (
            <div className={`p-5 rounded-2xl border shadow-sm relative overflow-hidden ${selectedRequest.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`absolute top-0 right-0 w-2 h-full ${selectedRequest.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <h3 className={`font-bold mb-2 text-sm ${selectedRequest.status === 'approved' ? 'text-green-800' : 'text-red-800'}`}>
                ملاحظات قرار {selectedRequest.status === 'approved' ? 'الموافقة' : 'الرفض'}:
              </h3>
              <p className={`text-sm font-bold leading-relaxed ${selectedRequest.status === 'approved' ? 'text-green-900' : 'text-red-900'} whitespace-pre-wrap`}>
                "{selectedRequest.decisionNote}"
              </p>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-[2rem] flex justify-end">
          <Button 
            onClick={() => setSelectedRequest(null)} 
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold rounded-xl px-8 shadow-sm h-11 outline-none cursor-pointer"
          >
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
}