import React from 'react';
import { User, Calendar, Eye, MessageSquare } from 'lucide-react';
import { Card } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { getStatusBadge, getStatusIcon, getStatusText } from './ComplaintsHelpers';

export default function ComplaintsList({ complaints, setSelectedComplaint }) {
  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-400">
        <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="font-bold text-lg">لا توجد شكاوى مطابقة للبحث أو التصفية</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="overflow-hidden bg-white border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[2rem]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="text-right px-6 py-5 text-sm font-bold text-gray-600">الشاكي</th>
                  <th className="text-right px-6 py-5 text-sm font-bold text-gray-600">تاريخ الشكوى</th>
                  <th className="text-right px-6 py-5 text-sm font-bold text-gray-600">الحالة</th>
                  <th className="text-center px-6 py-5 text-sm font-bold text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm bg-blue-50">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 text-sm block">{complaint.parentName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />{complaint.submissionDate}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 border px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${getStatusBadge(complaint.status)}`}>
                        {getStatusIcon(complaint.status)} {getStatusText(complaint.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <Button 
                        variant="ghost" 
                        onClick={() => setSelectedComplaint(complaint)} 
                        className="text-[#1e3a8a] bg-blue-50 hover:bg-blue-100 hover:text-blue-900 font-bold rounded-xl border-none text-xs px-5 py-2.5 outline-none shadow-sm cursor-pointer"
                      >
                        <Eye className="w-4 h-4 ml-2" /> مراجعة التفاصيل
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="bg-white rounded-[1.5rem] border border-gray-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-1.5 h-full ${
              complaint.status === 'resolved' ? 'bg-green-500' : 
              complaint.status === 'underReview' ? 'bg-blue-500' : 
              complaint.status === 'rejected' ? 'bg-red-500' : 
              'bg-orange-500'
            }`}></div>
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-50">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="font-bold text-gray-800 text-sm block mb-0.5">{complaint.parentName}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center text-sm mt-1">
              <span className="text-gray-500 font-bold text-xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> تاريخ الشكوى:
              </span>
              <span className="font-bold text-gray-800 font-mono tracking-wider">{complaint.submissionDate}</span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className={`inline-flex items-center gap-1 border px-3 py-1.5 rounded-lg text-[11px] font-bold ${getStatusBadge(complaint.status)}`}>
                {getStatusIcon(complaint.status)} {getStatusText(complaint.status)}
              </span>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedComplaint(complaint)} 
                className="text-[#1e3a8a] bg-blue-50 hover:bg-blue-100 font-bold rounded-lg border-none text-[11px] px-3 py-1.5 h-auto outline-none cursor-pointer"
              >
                <Eye className="w-3 h-3 ml-1" /> التفاصيل
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}