import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Component imports
import ScrollToTop from './components/ScrollToTop';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { AccountScreen } from './components/AccountScreen';

// Employee Screens
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { NewFamilyScreen } from './components/employee/NewFamilyScreen';
import { CaseDetailsScreen } from './components/employee/CaseDetailsScreen';
import { ViolationsScreen } from './components/employee/ViolationsScreen';
import { DataChangeRequestsScreen } from './components/employee/DataChangeRequestsScreen';
import { ComplaintsManagement } from './components/employee/ComplaintsManagement';
import { FamiliesManagement } from './components/employee/FamiliesManagement';
import { FamilyDetailsScreen } from './components/employee/FamilyDetailsScreen';

export default function App() {
  // ✅ التعديل: الاعتماد على توكن الموظف فقط
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('wesal_staff_token'));

  // ✅ التعديل: قراءة الصلاحية والبيانات من مفاتيح الموظف المعزولة
  const [userRole, setUserRole] = useState(() => {
    try {
      const savedData = localStorage.getItem('wesal_staff_user_data');
      const savedRole = localStorage.getItem('wesal_staff_user_role'); 
      return savedRole || (savedData ? JSON.parse(savedData).role : null);
    } catch (e) {
      console.error("Error reading data:", e);
      return null;
    }
  });

  // ✅ التعديل: عزل الشاشة الحالية لتجنب التداخل مع الأنظمة الأخرى
  const [currentScreen, setCurrentScreen] = useState(() => localStorage.getItem('wesal_staff_current_screen') || 'home');
  const [screenData, setScreenData] = useState(null);

  // --- Login Handler ---
  const handleLogin = (role) => {
    console.log("Logged in with role:", role);
    setIsLoggedIn(true);
    setUserRole(role);

    // ✅ التعديل: حفظ البيانات في مفتاح الموظف
    const existingData = localStorage.getItem('wesal_staff_user_data');
    let userData = existingData ? JSON.parse(existingData) : {};
    userData.role = role;
    localStorage.setItem('wesal_staff_user_data', JSON.stringify(userData));

    setCurrentScreen('home');
    localStorage.setItem('wesal_staff_current_screen', 'home');
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentScreen('home');
    setScreenData(null);

    // ✅ التعديل: تنظيف شامل لمفاتيح الموظف فقط
    localStorage.removeItem('wesal_staff_token');
    localStorage.removeItem('wesal_staff_user_data');
    localStorage.removeItem('wesal_staff_user_role');
    localStorage.removeItem('wesal_staff_current_screen');
    localStorage.removeItem('force_change_password');
  };

  const handleNavigate = (screen, data) => {
    console.log("Navigating to:", screen);
    setCurrentScreen(screen);
    setScreenData(data);
    localStorage.setItem('wesal_staff_current_screen', screen);
  };

  const handleBack = () => {
    handleNavigate('home', null);
  };

  // --- Main Render Function ---
  const renderContent = () => {
    // 1. Not logged in state
    if (!isLoggedIn) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    // 2. Employee Role (وهو الأساسي والوحيد في هذه النسخة)
    if (userRole === 'employee') {
      return (
        <div className="bg-background min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }} dir="rtl">
          <Sidebar currentScreen={currentScreen} onNavigate={handleNavigate} onLogout={handleLogout} />
          
          <div className="flex-1 mr-0 md:mr-28 transition-all duration-300 p-4">
            {currentScreen === 'home' && <EmployeeDashboard onNavigate={handleNavigate} />}

            {currentScreen === 'new-family' && (
              <NewFamilyScreen
                familyData={screenData}
                onBack={() => handleNavigate(screenData ? 'families-management' : 'home')}
                onSave={() => handleNavigate(screenData ? 'families-management' : 'home')}
              />
            )}

            {currentScreen === 'families-management' && <FamiliesManagement onNavigate={handleNavigate} onBack={handleBack} />}

            {currentScreen === 'family-details' && (
              <FamilyDetailsScreen
                familyId={screenData?.familyId}
                onNavigate={handleNavigate}
                onBack={() => handleNavigate('families-management')}
              />
            )}

            {currentScreen === 'case-details' && (
              <CaseDetailsScreen
                caseData={screenData}
                onNavigate={handleNavigate}
                onBack={() => handleNavigate('family-details', { familyId: screenData?.familyId })}
              />
            )}

            {currentScreen === 'violations' && <ViolationsScreen onBack={handleBack} />}
            {currentScreen === 'account' && <AccountScreen userType="employee" onLogout={handleLogout} onBack={handleBack} />}
            {currentScreen === 'data-change-requests' && <DataChangeRequestsScreen onNavigate={handleNavigate} onBack={handleBack} />}
            {currentScreen === 'complaints-management' && <ComplaintsManagement onNavigate={handleNavigate} onBack={handleBack} />}
          </div>
        </div>
      );
    }

    // 3. Fallback Role (لو دخل بصلاحية غير الموظف بالخطأ)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ في الصلاحيات</h1>
        <p className="mb-4 text-gray-700">أنت مسجل دخول ولكن ليس لديك صلاحية موظف محكمة.</p>
        <button
          onClick={handleLogout}
          className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg hover:bg-blue-900"
        >
          تسجيل الخروج والعودة
        </button>
      </div>
    );
  };

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {ScrollToTop && <ScrollToTop trigger={currentScreen} />}
      {renderContent()}
    </BrowserRouter>
  );
}