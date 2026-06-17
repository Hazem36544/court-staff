import React from 'react';
import { 
  AlertTriangle, XCircle, User, Calendar, AlertCircle, Clock, CheckCircle, ArrowLeftRight, Loader2
} from 'lucide-react';
import { Card } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { getStatusBadge, getStatusIcon, getViolationTypeLabel } from './ViolationsHelpers';

export function ViolationDetailsModal({ 
  selectedViolation, 
  setSelectedViolation, 
  selectedParentNationalId, 
  actionNotes, 
  setActionNotes, 
  actionLoading, 
  updateViolationStatus 
}) {
  if (!selectedViolation) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" dir="rtl">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 text-right rounded-[2rem] shadow-2xl flex flex-col border-none">
        
        <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 relative z-10 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#1e3a8a]/10 p-2.5 rounded-xl shrink-0">
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-[#1e3a8a]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800">تفاصيل المخالفة</h2>
              {/* ✅ التعديل هنا: حماية من الانهيار حتى لو الـ id غير موجود */}
              <p className="text-xs text-gray-500 font-bold mt-1">معرف: <span className="font-mono text-[10px] tracking-wider">
                {selectedViolation.id ? String(selectedViolation.id).split('-')[0] : 'غير متوفر'}
              </span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${getStatusBadge(selectedViolation.status)}`}>
              {getStatusIcon(selectedViolation.status)}
              {selectedViolation.status === 'Pending' ? 'قيد الانتظار' : selectedViolation.status === 'UnderReview' ? 'قيد المراجعة' : 'تم الحل'}
            </span>
            <button 
              onClick={() => { setSelectedViolation(null); setActionNotes(''); }} 
              className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800 outline-none border-none cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 md:p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-500 font-bold text-xs">الطرف المعني</span>
                <span className="font-bold text-gray-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#1e3a8a]" /> {selectedViolation.parentName}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-500 font-bold text-xs">الرقم القومي</span>
                <span className="font-bold text-gray-800 font-mono tracking-widest">{selectedParentNationalId}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-500 font-bold text-xs">نوع المخالفة</span>
                <span className="font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg w-max border border-red-100">
                  {getViolationTypeLabel(selectedViolation.type)}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-500 font-bold text-xs">تاريخ التنشيط</span>
                <span className="font-bold text-gray-800 flex items-center gap-2 font-mono">
                  <Calendar className="w-4 h-4 text-[#1e3a8a]" /> {selectedViolation.triggeredAt}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-4 left-4 text-gray-100 pointer-events-none">
              <AlertCircle className="w-12 h-12 opacity-40" />
            </div>
            <p className="text-xs text-gray-500 font-bold mb-2">وصف المخالفة وتفاصيلها:</p>
            <p className="text-sm font-bold text-gray-800 leading-relaxed whitespace-pre-wrap relative z-10">
              {selectedViolation.description || 'لا يوجد وصف مفصل لهذه المخالفة في النظام.'}
            </p>
          </div>

          {selectedViolation.status === 'Resolved' && (
            <div className="p-5 rounded-2xl border shadow-sm relative overflow-hidden bg-green-50 border-green-200">
              <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-green-800">
                  ملاحظات الإغلاق والحل:
                </p>
                {selectedViolation.resolvedAt && (
                  <p className="text-xs font-bold text-green-600">
                    تاريخ الحل: {selectedViolation.resolvedAt}
                  </p>
                )}
              </div>
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-green-900">
                "{selectedViolation.resolutionNotes || 'تم الإغلاق بدون ملاحظات.'}"
              </p>
            </div>
          )}

          {selectedViolation.status === 'Pending' && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-center">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-orange-800 mb-4">هذه المخالفة بانتظار البدء في إجراءات المراجعة.</p>
              <Button 
                onClick={() => updateViolationStatus('UnderReview')} 
                disabled={actionLoading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-md border-none flex items-center justify-center gap-2 cursor-pointer transition-all outline-none"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowLeftRight className="w-5 h-5" />}
                بدء المراجعة والتحويل لقيد المراجعة
              </Button>
            </div>
          )}

          {selectedViolation.status === 'UnderReview' && (
            <div className="space-y-3 bg-blue-50/30 p-5 rounded-2xl border border-blue-100">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                ملاحظات مراجعة وحل المخالفة:
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="قم بتسجيل الإجراءات المتخذة حيال هذه المخالفة هنا..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] resize-none font-medium text-sm shadow-sm"
              />
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  onClick={() => updateViolationStatus('Resolved')}
                  disabled={actionLoading || !actionNotes.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 font-bold h-11 rounded-xl shadow-sm outline-none border-none flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  تسجيل وحل المخالفة
                </Button>
              </div>
            </div>
          )}

        </div>
      </Card>
    </div>
  );
}