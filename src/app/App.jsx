import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import { Menu, Loader2 } from 'lucide-react'; 

import ScrollToTop from './components/ScrollToTop';
import { LoginScreen } from './components/employee/loginScreen/LoginScreen';
import { Sidebar } from './components/Sidebar';

// تطبيق التحميل الديناميكي للشاشات
const AccountScreen = lazy(() => import('./components/employee/accountScreen/AccountScreen').then(m => ({ default: m.AccountScreen })));
const EmployeeDashboard = lazy(() => import('./components/employee/employeeDashboard/EmployeeDashboard').then(m => ({ default: m.EmployeeDashboard })));
const NewFamilyScreen = lazy(() => import('./components/employee/newFamilyScreen/NewFamilyScreen').then(m => ({ default: m.NewFamilyScreen })));
const CaseDetailsScreen = lazy(() => import('./components/employee/caseDetailsScreen/CaseDetailsScreen').then(m => ({ default: m.CaseDetailsScreen })));
const CasesManagement = lazy(() => import('./components/employee/casesManagement/CasesManagement').then(m => ({ default: m.CasesManagement })));
const ViolationsScreen = lazy(() => import('./components/employee/violationsScreen/ViolationsScreen').then(m => ({ default: m.ViolationsScreen })));
const DataChangeRequestsScreen = lazy(() => import('./components/employee/dataChangeRequestsScreen/DataChangeRequestsScreen').then(m => ({ default: m.DataChangeRequestsScreen })));
const ComplaintsManagement = lazy(() => import('./components/employee/complaintsManagement/ComplaintsManagement').then(m => ({ default: m.ComplaintsManagement })));
const FamiliesManagement = lazy(() => import('./components/employee/familiesManagement/FamiliesManagement').then(m => ({ default: m.FamiliesManagement })));
const FamilyDetailsScreen = lazy(() => import('./components/employee/familyDetailsScreen/FamilyDetailsScreen').then(m => ({ default: m.FamilyDetailsScreen })));
const SchoolsManagement = lazy(() => import('./components/employee/schoolsManagement/SchoolsManagement').then(m => ({ default: m.SchoolsManagement })));
// ✅ إضافة شاشة التقرير الشخصي المنفصلة
const PerformanceReportScreen = lazy(() => import('./components/employee/performanceReportScreen/PerformanceReportScreen').then(m => ({ default: m.PerformanceReportScreen })));

// تعريف الأدوار المسموح لها بالدخول
const STAFF_ROLES = ['SettlementSpecialist', 'CaseClerk', 'ComplianceMonitor', 'employee'];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!sessionStorage.getItem('wesal_staff_token'));

  const [userRole, setUserRole] = useState(() => {
    try {
      const savedData = sessionStorage.getItem('wesal_staff_user_data');
      const savedRole = sessionStorage.getItem('wesal_staff_user_role'); 
      return savedRole || (savedData ? JSON.parse(savedData).role : null);
    } catch (e) {
      console.error("Error reading data:", e);
      return null;
    }
  });

  const [currentScreen, setCurrentScreen] = useState(() => sessionStorage.getItem('wesal_staff_current_screen') || 'home');
  const [screenData, setScreenData] = useState(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = (role) => {
    console.log("Logged in with role:", role);
    setIsLoggedIn(true);
    setUserRole(role);

    const existingData = sessionStorage.getItem('wesal_staff_user_data');
    let userData = existingData ? JSON.parse(existingData) : {};
    userData.role = role;
    sessionStorage.setItem('wesal_staff_user_data', JSON.stringify(userData));

    setCurrentScreen('home');
    sessionStorage.setItem('wesal_staff_current_screen', 'home');
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentScreen('home');
    setScreenData(null);
    setIsMobileMenuOpen(false); 

    sessionStorage.removeItem('wesal_staff_token');
    sessionStorage.removeItem('wesal_staff_user_data');
    sessionStorage.removeItem('wesal_staff_user_role');
    sessionStorage.removeItem('wesal_staff_current_screen');
    sessionStorage.removeItem('force_change_password');
    sessionStorage.removeItem('wesal_user_data'); 
    sessionStorage.removeItem('wesal_token'); 
  };

  const handleNavigate = (screen, data) => {
    console.log("Navigating to:", screen);
    setCurrentScreen(screen);
    setScreenData(data);
    sessionStorage.setItem('wesal_staff_current_screen', screen);
    setIsMobileMenuOpen(false); 
  };

  const handleBack = () => {
    handleNavigate('home', null);
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    if (STAFF_ROLES.includes(userRole)) {
      return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-right" dir="rtl">
          
          {/* Mobile Navbar */}
          <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1e3a8a] text-white z-40 flex items-center px-4 shadow-md justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors border-none outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="font-bold text-lg tracking-wide">بوابة الموظفين</span>
            </div>
            <img 
              src={`${import.meta.env.BASE_URL}logo.svg`} 
              alt="شعار وصال" 
              className="w-10 h-10 object-contain drop-shadow-md"
              onError={(e) => { e.target.src = 'https://placehold.co/40x40/png?text=Logo'; }}
            />
          </div>

          <Sidebar 
            currentScreen={currentScreen} 
            onNavigate={handleNavigate} 
            onLogout={handleLogout} 
            isOpen={isMobileMenuOpen} 
            setIsOpen={setIsMobileMenuOpen}
            userRole={userRole} 
          />

          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}

          <div className="flex-1 w-full overflow-y-auto pt-16 md:pt-0 md:pr-32 transition-all duration-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <main className="w-full max-w-7xl mx-auto p-4 md:p-8">
              
              <Suspense fallback={
                <div className="w-full flex flex-col items-center justify-center min-h-[60vh] font-sans" dir="rtl">
                  <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
                  <span className="text-[#1e3a8a] font-bold text-lg">جاري تحميل الشاشة...</span>
                </div>
              }>
                {currentScreen === 'home' && <EmployeeDashboard userRole={userRole} onNavigate={handleNavigate} />}

                {currentScreen === 'new-family' && (
                  <NewFamilyScreen
                    familyData={screenData}
                    onNavigate={handleNavigate} 
                    onBack={() => handleNavigate('families-management')}
                    onSave={() => handleNavigate('families-management')}
                  />
                )}

                {currentScreen === 'families-management' && <FamiliesManagement userRole={userRole} onNavigate={handleNavigate} onBack={handleBack} />}

                {currentScreen === 'schools-management' && <SchoolsManagement onNavigate={handleNavigate} onBack={handleBack} />}

                {currentScreen === 'cases-management' && <CasesManagement onNavigate={handleNavigate} onBack={handleBack} />}

                {currentScreen === 'family-details' && (
                  <FamilyDetailsScreen
                    familyId={screenData?.familyId}
                    userRole={userRole}
                    onNavigate={handleNavigate}
                    onBack={() => handleNavigate('families-management')}
                  />
                )}

                {currentScreen === 'case-details' && (
                  <CaseDetailsScreen
                    caseData={screenData}
                    userRole={userRole}
                    onNavigate={handleNavigate}
                    onBack={() => handleNavigate('cases-management')}
                  />
                )}

                {/* ✅ ربط شاشة التقارير الجديدة */}
                {currentScreen === 'performance-report' && <PerformanceReportScreen userRole={userRole} onBack={handleBack} />}

                {currentScreen === 'violations' && <ViolationsScreen onBack={handleBack} />}
                {currentScreen === 'account' && <AccountScreen userType="employee" onLogout={handleLogout} onBack={handleBack} />}
                {currentScreen === 'data-change-requests' && <DataChangeRequestsScreen onNavigate={handleNavigate} onBack={handleBack} />}
                {currentScreen === 'complaints-management' && <ComplaintsManagement onNavigate={handleNavigate} onBack={handleBack} />}
              </Suspense>
            </main>
          </div>

        </div>
      );
    }

    // Fallback Role
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4 font-sans" dir="rtl">
        <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ في الصلاحيات</h1>
        <p className="mb-4 text-gray-700 font-medium">أنت مسجل دخول ولكن ليس لديك صلاحية موظف محكمة صالح.</p>
        <button
          onClick={handleLogout}
          className="bg-[#1e3a8a] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-900 transition-colors shadow-sm"
        >
          تسجيل الخروج والعودة
        </button>
      </div>
    );
  };

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: '"Times New Roman", "Traditional Arabic", serif',
            fontWeight: 'bold',
            borderRadius: '9999px',
            padding: '12px 24px',
            direction: 'rtl',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
          },
          success: {
            style: {
              background: '#ECFDF5', 
              color: '#065F46',      
              border: '1px solid #A7F3D0',
            },
            iconTheme: {
              primary: '#10B981',    
              secondary: '#FFFFFF',
            },
          },
          error: {
            style: {
              background: '#FEF2F2', 
              color: '#991B1B',
              border: '1px solid #FECACA',
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }} 
      />

      {ScrollToTop && <ScrollToTop trigger={currentScreen} />}
      {renderContent()}
    </BrowserRouter>
  );
}