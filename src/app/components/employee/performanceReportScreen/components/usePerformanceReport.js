import { useState, useEffect } from 'react';
import api from '../../../../../services/api';

export const usePerformanceReport = (userRole) => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // جلب بيانات الموظف من الجلسة لعرضها في الهيدر
  const [userData, setUserData] = useState(() => {
    const saved = sessionStorage.getItem('wesal_staff_user_data') || sessionStorage.getItem('wesal_user_data');
    return saved ? JSON.parse(saved) : { fullName: '', role: '' };
  });

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        // تحديث بيانات المستخدم الأساسية إن أمكن
        try {
          // ✅ التعديل: court-staff بدلاً من court-staffs
          const profileRes = await api.get('/api/court-staff/me');
          if (profileRes.data) setUserData(profileRes.data);
        } catch (e) {
          console.warn("Could not fetch fresh profile", e);
        }

        // جلب تقرير الأداء
        // ✅ التعديل: court-staff بدلاً من court-staffs
        const reportRes = await api.get('/api/court-staff/me/report');
        setReportData(reportRes.data);
      } catch (error) {
        console.warn("Error fetching performance report:", error);
        // في حالة الخطأ (مثل 404 إذا كان الموظف جديداً)، نضع Object فارغ لعرض أصفار
        setReportData({}); 
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsPageLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const getRoleTitle = (role) => {
    if (role === 'SettlementSpecialist') return 'أخصائي تسوية منازعات';
    if (role === 'CaseClerk') return 'كاتب قضايا';
    if (role === 'ComplianceMonitor') return 'مراقب التزام';
    return 'موظف محكمة';
  };

  return {
    state: {
      isPageLoaded,
      reportData,
      loading,
      userData
    },
    helpers: {
      getRoleTitle
    }
  };
};