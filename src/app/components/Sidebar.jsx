import React, { useState } from 'react';
import {
  Home,
  Users,
  FileEdit,
  MessageSquare,
  AlertOctagon,
  User,
  LogOut,
  Briefcase,
  School,
  PieChart // ✅ تم استبدال الأيقونة بـ PieChart لتعبر عن التقارير بوضوح
} from 'lucide-react';

export function Sidebar({ currentScreen, onNavigate, onLogout, isOpen, setIsOpen, userRole }) {
  
  const [logoError, setLogoError] = useState(false);

  const getMenuItems = () => {
    const items = [
      { id: 'home', label: 'الرئيسية', icon: Home },
    ];

    if (userRole === 'SettlementSpecialist') {
      items.push({ id: 'families-management', label: 'العائلات', icon: Users });
      items.push({ id: 'schools-management', label: 'المدارس', icon: School }); 
      items.push({ id: 'data-change-requests', label: 'الطلبات', icon: FileEdit });
    } 
    else if (userRole === 'CaseClerk') {
      items.push({ id: 'cases-management', label: 'القضايا', icon: Briefcase });
    } 
    else if (userRole === 'ComplianceMonitor') {
      items.push({ id: 'complaints-management', label: 'الشكاوى', icon: MessageSquare });
      items.push({ id: 'violations', label: 'المخالفات', icon: AlertOctagon });
    } 
    else {
      // المشرف أو Employee عام
      items.push({ id: 'families-management', label: 'العائلات', icon: Users });
      items.push({ id: 'cases-management', label: 'القضايا', icon: Briefcase }); 
      items.push({ id: 'schools-management', label: 'المدارس', icon: School }); 
      items.push({ id: 'data-change-requests', label: 'الطلبات', icon: FileEdit });
      items.push({ id: 'complaints-management', label: 'الشكاوى', icon: MessageSquare });
      items.push({ id: 'violations', label: 'المخالفات', icon: AlertOctagon });
    }

    // ✅ استخدام الأيقونة الجديدة للتقارير
    items.push({ id: 'performance-report', label: 'التقارير', icon: PieChart });
    items.push({ id: 'account', label: 'الحساب', icon: User });

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div
      className={`fixed right-0 top-0 h-screen w-32 bg-[#1e3a8a] text-white flex flex-col items-center py-6 shadow-2xl z-50 font-sans rounded-l-[2.5rem] border-l border-white/5 transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      dir="rtl"
    >

      {/* --- 1. Logo --- */}
      <div className="mb-6 flex-shrink-0 w-full flex justify-center px-2">
        {!logoError ? (
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt="Logo"
            className="w-20 h-20 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-2xl"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#1e3a8a] font-extrabold text-xl shadow-lg border-2 border-blue-200">
            وصال
          </div>
        )}
      </div>

      {/* --- 2. Icons and Text --- */}
      <nav className="flex-1 w-full px-3 flex flex-col gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            currentScreen === item.id ||
            (item.id === 'families-management' && (currentScreen === 'new-family' || currentScreen === 'family-details')) ||
            (item.id === 'cases-management' && currentScreen === 'case-details');

          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (setIsOpen) setIsOpen(false);
              }}
              className={`
                w-full py-3 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all duration-300 group outline-none border-none cursor-pointer
                ${isActive
                  ? 'bg-white text-[#1e3a8a] shadow-lg scale-105'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <Icon className="w-7 h-7 transition-colors duration-300 mb-0.5" strokeWidth={2.5} />
              <span className="text-[11px] font-bold tracking-wide text-center leading-tight whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* --- 3. Logout --- */}
      <div className="mt-auto pt-4 w-full px-3 pb-2">
        <button
          onClick={() => {
            if (setIsOpen) setIsOpen(false);
            onLogout();
          }}
          className="w-full py-3 flex flex-col items-center justify-center gap-1 rounded-2xl text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-all duration-300 border border-transparent hover:border-red-500/20 outline-none cursor-pointer border-none"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-bold">خروج</span>
        </button>
      </div>

    </div>
  );
}