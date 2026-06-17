import React from 'react';
import { 
  Building, School, X, AlertCircle, AlertTriangle, 
  Loader2, Pencil, Trash2, Phone, CheckCircle, Copy 
} from 'lucide-react';
import { Card } from '../../../ui/card';

export default function SchoolsModals({
  showAddModal, setShowAddModal, isSaving, error, setError, formErrors, setFormErrors, newSchool, handleNewSchoolChange, handleAddSchool,
  selectedSchool, setSelectedSchool, isEditing, setIsEditing, handleStartEdit, editForm, setEditForm, isUpdating, handleUpdateSchool,
  deleteModal, setDeleteModal, isDeleting, confirmDelete,
  successCredentials, setSuccessCredentials, copyToClipboard
}) {
  return (
    <>
      {/* ✅ نافذة إضافة مدرسة (مع سكرول وطول محدد) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300" dir="rtl">
          <Card className="p-0 w-full max-w-lg bg-white border-none shadow-2xl rounded-[2.5rem] flex flex-col max-h-[90vh] overflow-hidden">
            <div className="bg-gray-50 p-5 border-b border-gray-100 flex justify-between items-center text-right shrink-0 rounded-t-[2.5rem]">
              <h2 className="text-lg md:text-xl font-bold text-[#1e3a8a] flex items-center gap-2">
                <Building className="w-5 h-5 md:w-6 md:h-6" /> تسجيل مدرسة جديدة
              </h2>
              <button onClick={() => { setShowAddModal(false); setFormErrors({}); setError(null); }} className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 shadow-sm border border-gray-100 outline-none cursor-pointer"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
            </div>

            <div className="p-6 md:p-8 space-y-6 text-right flex-1 overflow-y-auto custom-scrollbar">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" /> 
                  <span className="text-sm font-bold">{error}</span>
                </div>
              )}

              <form onSubmit={handleAddSchool} noValidate className="space-y-6">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-sm font-bold text-gray-700">اسم المدرسة بالكامل <span className="text-red-500">*</span></label>
                  <input 
                    type="text" name="name" value={newSchool.name} onChange={handleNewSchoolChange} 
                    className={`w-full p-4 rounded-xl outline-none transition-all font-bold text-sm shadow-sm border ${formErrors.name ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-400' : 'bg-gray-50 border-gray-100 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] focus:bg-white text-gray-800'}`} 
                    placeholder="مثال: مدرسة المستقبل للغات" 
                  />
                  {formErrors.name && <span className="text-red-500 text-[11px] font-bold flex items-start gap-1 mt-1 animate-in slide-in-from-top-1"><AlertTriangle className="w-3.5 h-3.5 shrink-0"/> {formErrors.name}</span>}
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-sm font-bold text-gray-700">العنوان التفصيلي <span className="text-red-500">*</span></label>
                  <input 
                    type="text" name="address" value={newSchool.address} onChange={handleNewSchoolChange} 
                    className={`w-full p-4 rounded-xl outline-none transition-all font-bold text-sm shadow-sm border ${formErrors.address ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-400' : 'bg-gray-50 border-gray-100 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] focus:bg-white text-gray-800'}`} 
                    placeholder="الشارع، المنطقة، المحافظة..." 
                  />
                  {formErrors.address && <span className="text-red-500 text-[11px] font-bold flex items-start gap-1 mt-1 animate-in slide-in-from-top-1"><AlertTriangle className="w-3.5 h-3.5 shrink-0"/> {formErrors.address}</span>}
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-sm font-bold text-gray-700">رقم التواصل <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" name="contactNumber" value={newSchool.contactNumber} maxLength={11}
                    onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, ''); handleNewSchoolChange(e); }}
                    className={`w-full p-4 rounded-xl outline-none transition-all font-mono text-right text-sm shadow-sm border ${formErrors.contactNumber ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-400' : 'bg-gray-50 border-gray-100 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] focus:bg-white text-gray-800'}`} 
                    dir="ltr" placeholder="01xxxxxxxxx" 
                  />
                  {formErrors.contactNumber && <span className="text-red-500 text-[11px] font-bold flex items-start gap-1 mt-1 animate-in slide-in-from-top-1" dir="rtl"><AlertTriangle className="w-3.5 h-3.5 shrink-0"/> {formErrors.contactNumber}</span>}
                </div>

                <div className="pt-4 flex gap-3 mt-4">
                  <button type="button" disabled={isSaving} onClick={() => { setShowAddModal(false); setFormErrors({}); setError(null); }} className="flex-1 bg-white text-gray-600 border border-gray-200 h-12 md:h-14 rounded-xl font-bold hover:bg-gray-50 transition-all outline-none cursor-pointer shadow-sm active:scale-95">إلغاء</button>
                  <button type="submit" disabled={isSaving} className="flex-1 bg-[#1e3a8a] text-white h-12 md:h-14 rounded-xl font-bold hover:bg-blue-900 transition-all flex items-center justify-center gap-2 shadow-sm border-none outline-none cursor-pointer active:scale-95">
                    {isSaving ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : "حفظ وتسجيل"}
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* ✅ نافذة التفاصيل والتعديل (نفس طول نافذة الإضافة) */}
      {selectedSchool && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300" dir="rtl">
          <Card className="p-0 w-full max-w-lg bg-white border-none shadow-2xl rounded-[2.5rem] flex flex-col max-h-[90vh] overflow-hidden">
            <div className="bg-[#1e3a8a] p-5 border-b border-white/10 flex justify-between items-center text-right shrink-0 rounded-t-[2.5rem]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <School className="w-5 h-5" /> ملف المدرسة
              </h2>
              <div className="flex gap-2">
                {!isEditing && (
                   <>
                     <button 
                       onClick={handleStartEdit} 
                       className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors border-none outline-none cursor-pointer"
                       title="تعديل البيانات"
                     >
                       <Pencil className="w-4 h-4" />
                     </button>
                     {/* ✅ زر الحذف تم نقله هنا بجوار التعديل */}
                     <button 
                       onClick={() => setDeleteModal({ show: true, id: selectedSchool.id, name: selectedSchool.name })} 
                       className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-100 hover:bg-red-500 hover:text-white transition-colors border-none outline-none cursor-pointer"
                       title="حذف المدرسة"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </>
                )}
                <button 
                  onClick={() => { setSelectedSchool(null); setIsEditing(false); }} 
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors border-none outline-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-right flex-1 overflow-y-auto custom-scrollbar">
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 text-right shadow-sm">
                <p className="text-xs text-blue-500 mb-1 font-bold">اسم المدرسة</p>
                <p className="font-bold text-[#1e3a8a] text-lg">{selectedSchool.name}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-right shadow-sm">
                <p className="text-xs text-gray-500 mb-1 font-bold">العنوان التفصيلي والمحافظة</p>
                <p className="font-bold text-gray-800 text-sm md:text-base leading-relaxed">{selectedSchool.governorate ? `${selectedSchool.governorate} - ` : ''}{selectedSchool.address}</p>
              </div>

              {!isEditing ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-right shadow-sm flex items-center gap-3">
                      <div className="bg-white p-2 rounded-xl border border-gray-100 shrink-0"><Phone className="w-5 h-5 text-[#1e3a8a]" /></div>
                      <div>
                         <p className="text-xs text-gray-500 mb-0.5 font-bold">رقم التواصل</p>
                         <p className="font-bold text-gray-800 text-sm font-mono" dir="ltr">{selectedSchool.contactNumber || 'غير متوفر'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-right shadow-sm">
                    <p className="text-xs text-gray-500 mb-1 font-bold">البريد الإلكتروني الرسمي</p>
                    <p className={`font-bold text-sm font-mono ${selectedSchool.email ? 'text-gray-800' : 'text-gray-400 italic'}`} dir="ltr">
                      {selectedSchool.email || 'غير متوفر'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex flex-col gap-1.5 relative">
                     <label className="text-sm font-bold text-gray-700">رقم التواصل الجديد</label>
                     <input 
                        type="tel" value={editForm.contactNumber} 
                        onChange={(e) => setEditForm({...editForm, contactNumber: e.target.value.replace(/\D/g, '')})} 
                        maxLength={11} placeholder="01xxxxxxxxx" dir="ltr"
                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 font-bold text-sm outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white text-right font-mono shadow-sm" 
                     />
                  </div>
                  <div className="flex flex-col gap-1.5 relative">
                     <label className="text-sm font-bold text-gray-700">البريد الإلكتروني الجديد</label>
                     <input 
                        type="email" value={editForm.email} 
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})} 
                        placeholder="school@example.com" dir="ltr"
                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 font-bold text-sm outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white text-right font-mono shadow-sm" 
                     />
                  </div>
                </div>
              )}

              {!isEditing && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 mt-4 flex items-start gap-3 text-right shadow-sm">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800 mb-1">بيانات الحساب</p>
                    <p className="text-xs md:text-sm text-amber-700 leading-relaxed font-bold">لأسباب أمنية، لا يتم عرض كلمة المرور هنا. إذا فقدت المدرسة بياناتها يرجى الاتصال بالإدارة لإعادة التعيين.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-3 rounded-b-[2.5rem]">
              {!isEditing ? (
                 <button onClick={() => setSelectedSchool(null)} className="w-full bg-white text-gray-700 border border-gray-200 h-12 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-sm outline-none active:scale-95 cursor-pointer">إغلاق النافذة</button>
              ) : (
                 <>
                   <button disabled={isUpdating} onClick={() => setIsEditing(false)} className="flex-1 bg-white text-gray-700 border border-gray-200 h-12 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-sm outline-none active:scale-95 cursor-pointer">إلغاء</button>
                   <button disabled={isUpdating} onClick={handleUpdateSchool} className="flex-1 bg-[#1e3a8a] text-white h-12 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-sm outline-none active:scale-95 cursor-pointer flex justify-center items-center gap-2">
                     {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "حفظ التعديلات"}
                   </button>
                 </>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ✅ تأكيد الحذف (z-index أعلى ليظهر فوق التفاصيل) */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in" dir="rtl">
            <Card className="p-0 bg-white rounded-[2rem] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 text-center border-none">
                <div className="p-6 md:p-8">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 mx-auto shadow-inner">
                      <Trash2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-3">تأكيد الحذف</h2>
                  <p className="text-gray-500 text-sm font-bold mb-6 px-2 leading-relaxed">
                      هل أنت متأكد من حذف المدرسة <span className="text-gray-800 underline decoration-red-200">"{deleteModal.name}"</span>؟ لا يمكن التراجع عن هذا الإجراء وسيتم حذف بيانات حسابها.
                  </p>
                  <div className="flex gap-3">
                      <button
                          onClick={() => setDeleteModal({ show: false, id: null, name: '' })}
                          disabled={isDeleting}
                          className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-sm outline-none cursor-pointer"
                      >
                          تراجع
                      </button>
                      <button
                          onClick={confirmDelete}
                          disabled={isDeleting}
                          className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-bold shadow-sm hover:bg-red-700 transition-all active:scale-95 border-none outline-none cursor-pointer flex justify-center items-center gap-2"
                      >
                          {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "نعم، احذف المدرسة"}
                      </button>
                  </div>
                </div>
            </Card>
        </div>
      )}

      {/* ✅ نافذة النجاح للحساب الجديد */}
      {successCredentials && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in zoom-in duration-300">
          <Card className="p-0 bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full text-center border-none" dir="rtl">
            <div className="p-6 md:p-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-green-100">
                <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-2">تم تسجيل المدرسة!</h2>
              <p className="text-gray-500 mb-8 text-sm font-bold">تم إنشاء حساب مخصص. يرجى نسخ البيانات ومشاركتها مع إدارة المدرسة.</p>

              <div className="bg-emerald-50/50 p-5 md:p-6 rounded-3xl border border-emerald-100 mb-8 text-right relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-20 h-20 bg-emerald-100 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl opacity-60"></div>
                <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2 relative z-10"><School className="w-5" /> بيانات الحساب</h3>

                <div className="space-y-3 relative z-10">
                  <div className="bg-white p-3 md:p-3.5 rounded-xl border border-emerald-100 flex justify-between items-center group shadow-sm">
                    <div className="text-right overflow-hidden flex-1 pl-2">
                      <span className="text-[10px] md:text-xs text-emerald-500 block mb-0.5 uppercase tracking-widest font-bold">اسم المستخدم</span>
                      <span className="text-xs md:text-sm font-mono font-bold text-emerald-900 truncate block" dir="ltr">{successCredentials.username}</span>
                    </div>
                    <button onClick={() => copyToClipboard(successCredentials.username)} className="w-10 h-10 shrink-0 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800 transition-colors outline-none border-none cursor-pointer"><Copy className="w-4 h-4" /></button>
                  </div>
                  <div className="bg-white p-3 md:p-3.5 rounded-xl border border-emerald-100 flex justify-between items-center group shadow-sm">
                    <div className="text-right overflow-hidden flex-1 pl-2">
                      <span className="text-[10px] md:text-xs text-emerald-500 block mb-0.5 uppercase tracking-widest font-bold">كلمة المرور المؤقتة</span>
                      <span className="text-xs md:text-sm font-mono font-bold text-emerald-900 truncate block" dir="ltr">{successCredentials.temporaryPassword}</span>
                    </div>
                    <button onClick={() => copyToClipboard(successCredentials.temporaryPassword)} className="w-10 h-10 shrink-0 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800 transition-colors outline-none border-none cursor-pointer"><Copy className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              <button onClick={() => setSuccessCredentials(null)} className="bg-[#1e3a8a] text-white h-12 md:h-14 rounded-xl md:rounded-2xl font-bold w-full hover:bg-blue-900 transition-all text-base md:text-lg shadow-lg shadow-blue-900/20 border-none outline-none active:scale-95 cursor-pointer">تم، إغلاق النافذة</button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}