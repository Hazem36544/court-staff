import React from 'react';
import { CheckCircle, Users, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SuccessScreen({ successData, onNavigate }) {
  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("تم النسخ!");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center font-sans" dir="rtl">
      <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.05)] p-8 md:p-10 max-w-4xl w-full text-center border border-gray-100 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2">تم فتح الملف بنجاح!</h2>
        <p className="text-gray-500 font-bold mb-10">تم تسجيل العائلة وإصدار بيانات تسجيل الدخول الرسمية.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-right">
          <div className="bg-blue-50/50 p-6 md:p-8 rounded-[2rem] border border-blue-100/50 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl opacity-50"></div>
            <h3 className="font-bold text-blue-900 mb-5 flex items-center gap-2 relative z-10"><Users className="w-5 h-5" /> حساب الأب</h3>
            <div className="space-y-3 relative z-10">
              <div className="bg-white px-4 py-3 rounded-xl border border-blue-100 flex justify-between items-center group hover:border-blue-300 transition-colors">
                <span className="text-sm font-mono font-bold text-blue-900 tracking-wider truncate" dir="ltr">{successData.family.fatherCredential?.username}</span>
                <button onClick={() => copyToClipboard(successData.family.fatherCredential?.username)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors border-none outline-none shrink-0 cursor-pointer"><Copy className="w-4 h-4" /></button>
              </div>
              <div className="bg-white px-4 py-3 rounded-xl border border-blue-100 flex justify-between items-center group hover:border-blue-300 transition-colors">
                <span className="text-sm font-mono font-bold text-blue-900 tracking-widest truncate" dir="ltr">{successData.family.fatherCredential?.temporaryPassword}</span>
                <button onClick={() => copyToClipboard(successData.family.fatherCredential?.temporaryPassword)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors border-none outline-none shrink-0 cursor-pointer"><Copy className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div className="bg-pink-50/50 p-6 md:p-8 rounded-[2rem] border border-pink-100/50 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-32 h-32 bg-pink-100 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl opacity-50"></div>
            <h3 className="font-bold text-pink-900 mb-5 flex items-center gap-2 relative z-10"><Users className="w-5 h-5" /> حساب الأم</h3>
            <div className="space-y-3 relative z-10">
              <div className="bg-white px-4 py-3 rounded-xl border border-pink-100 flex justify-between items-center group hover:border-pink-300 transition-colors">
                <span className="text-sm font-mono font-bold text-pink-900 tracking-wider truncate" dir="ltr">{successData.family.motherCredential?.username}</span>
                <button onClick={() => copyToClipboard(successData.family.motherCredential?.username)} className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors border-none outline-none shrink-0 cursor-pointer"><Copy className="w-4 h-4" /></button>
              </div>
              <div className="bg-white px-4 py-3 rounded-xl border border-pink-100 flex justify-between items-center group hover:border-pink-300 transition-colors">
                <span className="text-sm font-mono font-bold text-pink-900 tracking-widest truncate" dir="ltr">{successData.family.motherCredential?.temporaryPassword}</span>
                <button onClick={() => copyToClipboard(successData.family.motherCredential?.temporaryPassword)} className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors border-none outline-none shrink-0 cursor-pointer"><Copy className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => onNavigate('family-details', { familyId: successData.family.familyId })} className="bg-[#1e3a8a] text-white px-8 py-4 md:py-5 rounded-2xl font-bold w-full hover:bg-blue-900 transition-all text-lg shadow-lg border-none outline-none cursor-pointer active:scale-95">الانتقال لملف العائلة (لإضافة قضية)</button>
      </div>
    </div>
  );
}