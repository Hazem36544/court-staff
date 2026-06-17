import React from 'react';
import { 
  Users, CheckCircle, FileText, FolderOpen, 
  MessageSquare, AlertTriangle, Scale, Briefcase 
} from 'lucide-react';

export function PerformanceCards({ reportData, userRole, userData }) {
  if (!reportData) return null;
  const role = userRole || userData.role;
  const data = reportData;

  let cards = [];

  // تخصيص الكروت بناءً على نوع الموظف (RBAC)
  if (role === 'SettlementSpecialist') {
    cards = [
      { title: 'إجمالي العائلات المسجلة', value: data.totalFamiliesEnrolled || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { title: 'تسويات ودية ناجحة', value: data.successfulSettlements || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
      { title: 'حالات مُصعدة للقضاء', value: data.escalatedFamilies || 0, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];
  } else if (role === 'CaseClerk') {
    cards = [
      { title: 'إجمالي القضايا المستلمة', value: data.totalCasesAssigned || 0, icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
      { title: 'القضايا المغلقة', value: data.casesClosed || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    ];
  } else if (role === 'ComplianceMonitor') {
    cards = [
      { title: 'شكاوى مستلمة للتحقيق', value: data.totalComplaintsAssigned || 0, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
      { title: 'شكاوى تم حلها', value: data.complaintsResolved || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
      { title: 'مخالفات مسجلة', value: data.totalAlertsAssigned || 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
      { title: 'مخالفات تمت تسويتها', value: data.alertsResolved || 0, icon: Scale, color: 'text-teal-600', bg: 'bg-teal-50' },
      { title: 'شكاوى معادة (مرفوضة)', value: data.refiledComplaints || 0, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];
  }

  // الكروت المشتركة للجميع
  cards.push({ title: 'مهام قيد العمل حالياً', value: data.currentlyOpenItems || 0, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' });

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 px-1 mb-5">
          <span className="w-1.5 h-6 bg-[#1e3a8a] rounded-full inline-block"></span>
          إحصائيات المهام
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white border border-gray-100 p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm text-gray-500 font-bold mb-1">{card.title}</p>
              <p className={`text-3xl font-black font-mono ${card.color}`}>{card.value}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg}`}>
              <card.icon className={`w-7 h-7 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}