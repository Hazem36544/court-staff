import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { authAPI, courtAPI } from '../../../../services/api';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../../../../utils/errorHandler';

// استيراد المكونات
import AccountHeader from './components/AccountHeader';
import ProfileCard from './components/ProfileCard';
import BasicInfo from './components/BasicInfo';
import SecurityBanner from './components/SecurityBanner';

// ✅ دالة لترجمة المسمى الوظيفي
const translateRole = (role) => {
  if (!role) return 'موظف محكمة';
  switch (role) {
    case 'SettlementSpecialist':
      return 'أخصائي تسوية';
    case 'CaseClerk':
      return 'كاتب قضايا';
    case 'ComplianceMonitor':
      return 'مراقب التزام';
    default:
      return 'موظف محكمة';
  }
};

export function AccountScreen({ userType, onLogout, onBack }) {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [profileData, setProfileData] = useState(() => {
    const savedUser = sessionStorage.getItem('wesal_user_data') || sessionStorage.getItem('wesal_staff_user_data');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await (userType === 'employee' ? courtAPI.getProfile() : authAPI.getCurrentUser());
        setProfileData(res.data);
        
        sessionStorage.setItem('wesal_user_data', JSON.stringify(res.data));
        if (userType === 'employee') {
           sessionStorage.setItem('wesal_staff_user_data', JSON.stringify(res.data));
        }
      } catch (error) {
        console.error("Failed to refresh profile data", error);
        toast.error(getErrorMessage(error));
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [userType]);

  useEffect(() => {
    if (!loadingProfile) {
      const timer = setTimeout(() => setIsPageLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loadingProfile]);

  const handleLogoutSafe = () => {
    sessionStorage.removeItem('wesal_token');
    sessionStorage.removeItem('wesal_user_data');
    sessionStorage.removeItem('wesal_staff_token'); 
    sessionStorage.removeItem('wesal_staff_user_data');
    sessionStorage.removeItem('wesal_staff_user_role');
    
    onLogout();
  };

  if (loadingProfile && !profileData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[80vh] font-sans" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
        <span className="text-[#1e3a8a] font-bold text-lg">جاري تحميل بيانات الحساب...</span>
      </div>
    );
  }

  // تجهيز البيانات للعرض
  const displayName = profileData?.fullName || profileData?.name || 'غير متوفر';
  const displayUsername = profileData?.userName || profileData?.id || 'غير متوفر';
  const displayPhone = profileData?.phone || profileData?.phoneNumber || 'غير متوفر';
  const displayEmail = profileData?.email || 'غير متوفر';
  const displayRole = translateRole(profileData?.role);

  return (
    <div className="w-full font-sans" dir="rtl">
      <div className={`transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 pb-10 px-4 md:px-0">

          <AccountHeader onBack={onBack} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-1">
                <ProfileCard 
                    displayName={displayName} 
                    displayRole={displayRole} 
                    onLogout={handleLogoutSafe} 
                />
            </div>

            <div className="lg:col-span-2">
                <BasicInfo 
                    displayName={displayName}
                    displayUsername={displayUsername} 
                    displayPhone={displayPhone} 
                    displayEmail={displayEmail}
                    displayRole={displayRole}
                />
            </div>
          </div>

          <SecurityBanner />

        </div>
      </div>
    </div>
  );
}