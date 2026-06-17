import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../../../../services/api';
import { toast } from 'react-hot-toast';

import { generateStatsCards } from './components/DashboardHelpers';
import DashboardHeader from './components/DashboardHeader';
import DashboardStats from './components/DashboardStats';
import DashboardPerformance from './components/DashboardPerformance';

export function EmployeeDashboard({ onNavigate, userRole }) {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const [userData, setUserData] = useState(() => {
    const saved = sessionStorage.getItem('wesal_staff_user_data') || sessionStorage.getItem('wesal_user_data');
    return saved ? JSON.parse(saved) : { fullName: '', role: '' };
  });

  const [reportData, setReportData] = useState(null);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingActivities(true);

        try {
          const profileRes = await api.get('/api/court-staff/me');
          if (profileRes && profileRes.data) {
            setUserData(profileRes.data);
            const currentData = JSON.parse(sessionStorage.getItem('wesal_staff_user_data') || '{}');
            const mergedData = { ...currentData, ...profileRes.data };
            sessionStorage.setItem('wesal_staff_user_data', JSON.stringify(mergedData));
          }
        } catch (err) {
          console.warn("لم نتمكن من جلب بيانات الملف الشخصي:", err);
        }

        try {
          const reportRes = await api.get('/api/court-staff/me/report');
          if (reportRes && reportRes.data) {
            setReportData(reportRes.data);
          }
        } catch (err) {
          console.warn("لم يتم العثور على تقرير أداء لهذا الموظف أو حدث خطأ بالسيرفر:", err);
          setReportData({}); 
        }

      } catch (error) {
        console.error("Critical Dashboard Error:", error);
        toast.error("حدث خطأ أثناء تحميل بعض بيانات لوحة التحكم.");
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loadingActivities) {
      const timer = setTimeout(() => setIsPageLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loadingActivities]);

  const today = new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
  const stats = generateStatsCards(reportData, userRole, userData);

  if (loadingActivities) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[80vh] font-sans" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
        <span className="text-[#1e3a8a] font-bold text-lg">جاري تحميل لوحة التحكم...</span>
      </div>
    );
  }

  return (
    <div className="w-full font-sans" dir="rtl">
      <div className={`transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 pb-10 px-4 md:px-0">
          
          <DashboardHeader 
            userData={userData} 
            userRole={userRole} 
            today={today} 
          />

          <DashboardStats 
            stats={stats} 
            onNavigate={onNavigate} 
          />

          <DashboardPerformance 
            reportData={reportData} 
          />

        </div>
      </div>
    </div>
  );
}