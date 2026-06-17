import React from 'react';

export default function DashboardStats({ stats, onNavigate }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
      {stats.map((stat, index) => (
        <div
          key={`${stat.id}-${index}`}
          onClick={() => onNavigate(stat.screen)}
          className="group bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-blue-200 hover:-translate-y-1.5 transition-all duration-500 ease-out rounded-[2rem] p-6 cursor-pointer relative overflow-hidden outline-none"
        >
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out`}>
              <stat.icon className="w-7 h-7 text-white" />
            </div>
            <p className="text-3xl font-bold mb-1 text-gray-800 font-mono">{stat.value}</p>
            <p className="text-sm text-gray-500 font-bold">{stat.title}</p>
          </div>
          <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-[0.03] rounded-full blur-xl group-hover:opacity-10 transition-opacity duration-500 ease-out pointer-events-none`}></div>
        </div>
      ))}
    </div>
  );
}