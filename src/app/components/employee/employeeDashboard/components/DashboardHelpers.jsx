import {
  Users, Briefcase, AlertTriangle, MessageSquare,
  FileEdit, Scale, Loader2, CheckCircle, FileText, FolderOpen
} from 'lucide-react';

export const getRoleTitle = (role) => {
  if (role === 'SettlementSpecialist') return 'أخصائي تسوية منازعات';
  if (role === 'CaseClerk') return 'كاتب قضايا';
  if (role === 'ComplianceMonitor') return 'مراقب التزام';
  return 'موظف محكمة';
};

export const generateStatsCards = (reportData, userRole, userData) => {
  const data = reportData || {};
  const role = userRole || userData.role;

  if (role === 'SettlementSpecialist') {
    return [
      { id: 'enrolled', title: 'إجمالي العائلات', value: data.totalFamiliesEnrolled || 0, icon: Users, color: 'bg-blue-600', screen: 'families-management' },
      { id: 'settled', title: 'تسويات ناجحة', value: data.successfulSettlements || 0, icon: CheckCircle, color: 'bg-green-500', screen: 'families-management' },
      { id: 'escalated', title: 'حالات مُصعدة', value: data.escalatedFamilies || 0, icon: FileText, color: 'bg-orange-500', screen: 'families-management' },
      { id: 'open', title: 'حالات قيد العمل', value: data.currentlyOpenItems || 0, icon: Loader2, color: 'bg-teal-500', screen: 'families-management' },
    ];
  } 
  
  if (role === 'CaseClerk') {
    return [
      { id: 'assigned', title: 'القضايا المستلمة', value: data.totalCasesAssigned || 0, icon: FolderOpen, color: 'bg-blue-600', screen: 'cases-management' },
      { id: 'closed', title: 'القضايا المغلقة', value: data.casesClosed || 0, icon: CheckCircle, color: 'bg-green-500', screen: 'cases-management' },
      { id: 'open', title: 'قضايا جارية', value: data.currentlyOpenItems || 0, icon: FileEdit, color: 'bg-orange-500', screen: 'cases-management' },
    ];
  }

  if (role === 'ComplianceMonitor') {
    return [
      { id: 'complaints', title: 'شكاوى للتحقيق', value: data.totalComplaintsAssigned || 0, icon: MessageSquare, color: 'bg-orange-500', screen: 'complaints-management' },
      { id: 'resolved-complaints', title: 'شكاوى محلولة', value: data.complaintsResolved || 0, icon: CheckCircle, color: 'bg-green-500', screen: 'complaints-management' },
      { id: 'alerts', title: 'مخالفات مرصودة', value: data.totalAlertsAssigned || 0, icon: AlertTriangle, color: 'bg-red-500', screen: 'violations' },
      { id: 'resolved-alerts', title: 'مخالفات مسواة', value: data.alertsResolved || 0, icon: Scale, color: 'bg-teal-500', screen: 'violations' },
    ];
  }

  return [
    { id: 'families', title: 'العائلات المسجلة', value: data.totalFamiliesEnrolled || 0, icon: Users, color: 'bg-blue-600', screen: 'families-management' },
    { id: 'open', title: 'المهام الحالية', value: data.currentlyOpenItems || 0, icon: Briefcase, color: 'bg-orange-500', screen: 'families-management' },
  ];
};