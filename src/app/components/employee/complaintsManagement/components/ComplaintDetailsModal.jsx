import React from 'react';
import { 
  MessageSquare, XCircle, FileText, Loader2, 
  CheckCircle, XOctagon, Clock, ArrowLeftRight 
} from 'lucide-react';
import { Card } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { getStatusBadge, getStatusIcon, getStatusText } from './ComplaintsHelpers';

export default function ComplaintDetailsModal({
  selectedComplaint, setSelectedComplaint, documentLoading, documentDetails,
  handleDownloadDocument, fetchDocumentDetails, response, setResponse,
  actionLoading, handleUpdateStatus, handleUnderReview
}) {
  if (!selectedComplaint) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" dir="rtl">
      <Card className="w-full max-w-xl bg-white max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 text-right rounded-[2rem] shadow-2xl flex flex-col border-none">
        
        <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 relative z-10 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#1e3a8a]/10 p-2.5 rounded-xl shrink-0">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-[#1e3a8a]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800">تفاصيل الشكوى</h2>
              <p className="text-xs text-gray-500 font-bold mt-1">معرف: <span className="font-mono text-[10px] tracking-wider">{selectedComplaint.complaintNumber}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${getStatusBadge(selectedComplaint.status)}`}>
              {getStatusIcon(selectedComplaint.status)}
              {getStatusText(selectedComplaint.status)}
            </span>
            <button 
              onClick={() => { setSelectedComplaint(null); setResponse(''); }} 
              className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800 outline-none cursor-pointer border-none"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 md:p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-500 font-bold text-xs">اسم الشاكي</span>
                <span className="font-bold text-gray-800">{selectedComplaint.parentName}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-500 font-bold text-xs">الموضوع / النوع</span>
                <span className="font-bold text-gray-800">{selectedComplaint.subject}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-gray-500 font-bold text-xs">تاريخ التقديم</span>
                <span className="font-bold text-gray-800 font-mono tracking-wider">{selectedComplaint.submissionDate}</span>
              </div>
              <div className="flex flex-col gap-1.5 border-t border-gray-200 pt-3">
                <span className="text-gray-500 font-bold text-xs">الوصف التفصيلي:</span>
                <p className="text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedComplaint.description}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2 px-1">
              <FileText className="w-4 h-4 text-[#1e3a8a]" /> المستندات المرفقة
            </h3>
            {!selectedComplaint.documentId ? (
              <div className="w-full text-center py-6 border border-dashed border-gray-300 rounded-2xl bg-gray-50 text-gray-500">
                <p className="text-sm font-bold">لا يوجد مستند مرفق بهذه الشكوى.</p>
              </div>
            ) : documentLoading ? (
              <div className="w-full flex flex-col items-center justify-center py-6 border border-gray-100 rounded-2xl bg-white shadow-sm">
                <Loader2 className="w-6 h-6 animate-spin text-[#1e3a8a] mb-2" />
                <p className="text-sm font-bold text-gray-500">جاري تحميل المستند...</p>
              </div>
            ) : documentDetails ? (
              <div className="w-full border border-gray-100 rounded-2xl p-4 bg-white shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate text-gray-800" title={documentDetails.fileName || documentDetails.name || 'دليل مرفق'}>
                      {documentDetails.fileName || documentDetails.name || 'دليل مرفق'}
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full border-none bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-xl h-11 shadow-sm outline-none cursor-pointer"
                  onClick={handleDownloadDocument}
                >
                  تحميل المستند
                </Button>
              </div>
            ) : (
              <div className="w-full text-center py-6 border border-red-100 rounded-2xl bg-red-50 text-red-600">
                <p className="text-sm font-bold mb-3">فشل تحميل معلومات المستند.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 bg-white text-red-600 hover:bg-red-100 font-bold outline-none cursor-pointer"
                  onClick={() => fetchDocumentDetails(selectedComplaint.documentId)}
                >
                  إعادة المحاولة
                </Button>
              </div>
            )}
          </div>

          {selectedComplaint.status === 'resolved' && (
            <div className={`p-5 rounded-2xl border shadow-sm relative overflow-hidden bg-green-50 border-green-200`}>
              <div className={`absolute top-0 right-0 w-2 h-full bg-green-500`}></div>
              <div className="flex justify-between items-center mb-2">
                <p className={`text-sm font-bold text-green-800`}>ملاحظات الحل والرد:</p>
                {selectedComplaint.responseDate && (
                  <p className={`text-xs font-bold text-green-600`}>بتاريخ: {selectedComplaint.responseDate}</p>
                )}
              </div>
              <p className={`text-sm font-medium leading-relaxed whitespace-pre-wrap text-green-900`}>
                "{selectedComplaint.response || 'لا توجد ملاحظات مقدمة.'}"
              </p>
            </div>
          )}

          {selectedComplaint.status === 'rejected' && (
            <div className={`p-5 rounded-2xl border shadow-sm relative overflow-hidden bg-red-50 border-red-200`}>
              <div className={`absolute top-0 right-0 w-2 h-full bg-red-500`}></div>
              <div className="flex justify-between items-center mb-2">
                <p className={`text-sm font-bold text-red-800`}>أسباب الرفض:</p>
                {selectedComplaint.responseDate && (
                  <p className={`text-xs font-bold text-red-600`}>بتاريخ: {selectedComplaint.responseDate}</p>
                )}
              </div>
              <p className={`text-sm font-medium leading-relaxed whitespace-pre-wrap text-red-900`}>
                "{selectedComplaint.response || 'لا توجد ملاحظات مقدمة.'}"
              </p>
            </div>
          )}

          {selectedComplaint.status === 'pending' && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-center">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-orange-800 mb-4">هذه الشكوى بانتظار البدء في إجراءات المراجعة.</p>
              <Button 
                onClick={handleUnderReview} 
                disabled={actionLoading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-md border-none flex items-center justify-center gap-2 cursor-pointer transition-all outline-none"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowLeftRight className="w-5 h-5" />}
                بدء المراجعة والتحويل لقيد المراجعة
              </Button>
            </div>
          )}

          {selectedComplaint.status === 'underReview' && (
            <div className="space-y-3 bg-blue-50/30 p-5 rounded-2xl border border-blue-100">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                الرد الرسمي أو أسباب الرفض:
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="اكتب هنا الإجراءات المتخذة أو أسباب الرفض بوضوح..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] resize-none font-medium text-sm shadow-sm"
              />
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  onClick={() => handleUpdateStatus('Resolved')}
                  disabled={!response.trim() || actionLoading}
                  className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 font-bold h-11 rounded-xl shadow-sm outline-none border-none flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  اعتماد وحل
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('Rejected')}
                  disabled={!response.trim() || actionLoading}
                  className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 font-bold h-11 rounded-xl shadow-sm outline-none border-none flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <XOctagon className="w-5 h-5" />}
                  رفض / إعادة
                </Button>
              </div>
            </div>
          )}

        </div>
      </Card>
    </div>
  );
}