import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../../../../utils/errorHandler';

// استيراد المكونات الفرعية
import SchoolsHeader from './components/SchoolsHeader';
import SchoolsSearchStats from './components/SchoolsSearchStats';
import SchoolsGrid from './components/SchoolsGrid';
import SchoolsModals from './components/SchoolsModals';

export function SchoolsManagement({ onNavigate, onBack }) {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // States الأساسية والبحث اللحظي
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // State الـ Pagination
  const [visibleCount, setVisibleCount] = useState(9);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ contactNumber: '', email: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const [newSchool, setNewSchool] = useState({ name: '', address: '', contactNumber: '' });
  const [successCredentials, setSuccessCredentials] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const params = { PageNumber: 1, PageSize: 1000 }; 
      const response = await api.get('/api/schools', { params });
      const items = response.data?.items || [];
      setSchools(items);
      setFilteredSchools(items);
      setTotalCount(response.data?.totalCount || items.length);
    } catch (err) {
      toast.error(getErrorMessage(err) || "حدث خطأ أثناء جلب قائمة المدارس");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchools(); }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSchools(schools);
    } else {
      const term = searchTerm.toLowerCase().trim();
      setFilteredSchools(schools.filter(s => s.name?.toLowerCase().includes(term)));
    }
    setVisibleCount(9);
  }, [searchTerm, schools]);

  const clearSearch = () => { setSearchTerm(''); setVisibleCount(9); };
  const handleLoadMore = () => setVisibleCount(prev => prev + 9);

  const validateForm = () => {
    let errors = {}; let isValid = true;
    if (!newSchool.name.trim()) { errors.name = "اسم المدرسة مطلوب"; isValid = false; }
    if (!newSchool.address.trim()) { errors.address = "العنوان التفصيلي مطلوب"; isValid = false; }
    if (!newSchool.contactNumber.trim()) {
      errors.contactNumber = "رقم التواصل مطلوب"; isValid = false;
    } else {
      const phoneRegex = /^01[0125]\d{8}$/;
      if (!phoneRegex.test(newSchool.contactNumber.replace(/\s+/g, ''))) {
        errors.contactNumber = "يجب أن يبدأ الرقم بـ 010 أو 011 أو 012 أو 015 ومكون من 11 رقم"; isValid = false;
      }
    }
    setFormErrors(errors); return isValid;
  };

  const handleNewSchoolChange = (e) => {
    const { name, value } = e.target;
    setNewSchool({ ...newSchool, [name]: value });
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
    if (error) setError(null);
  };

  const handleAddSchool = async (e) => {
    e.preventDefault();
    if (!validateForm()) { toast.error("يرجى مراجعة وتصحيح الأخطاء في البيانات"); return; }
    setIsSaving(true); setError(null);
    try {
      const payload = { name: newSchool.name.trim(), address: newSchool.address.trim(), contactNumber: newSchool.contactNumber.trim() };
      const res = await api.post('/api/schools', payload);
      setSuccessCredentials(res.data); fetchSchools();
      setNewSchool({ name: '', address: '', contactNumber: '' });
      setFormErrors({}); setShowAddModal(false);
      toast.success("تم تسجيل المدرسة وإنشاء الحساب بنجاح!");
    } catch (err) {
      setError(getErrorMessage(err) || "فشل تسجيل المدرسة. يرجى المراجعة والمحاولة.");
    } finally { setIsSaving(false); }
  };

  const handleStartEdit = () => {
    setEditForm({ contactNumber: selectedSchool.contactNumber || '', email: selectedSchool.email || '' });
    setIsEditing(true);
  };

  const handleUpdateSchool = async () => {
    if (editForm.contactNumber && !/^01[0125]\d{8}$/.test(editForm.contactNumber)) {
      toast.error("رقم الهاتف غير صحيح، يجب أن يبدأ بـ 01 ومكون من 11 رقم"); return;
    }
    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
       toast.error("صيغة البريد الإلكتروني غير صحيحة"); return;
    }
    setIsUpdating(true);
    try {
      const payload = { contactNumber: editForm.contactNumber.trim() || null, email: editForm.email.trim() || null };
      await api.put(`/api/schools/${selectedSchool.id}`, payload);
      toast.success("تم تحديث بيانات المدرسة بنجاح"); setIsEditing(false);
      setSelectedSchool(prev => ({ ...prev, contactNumber: payload.contactNumber, email: payload.email }));
      fetchSchools();
    } catch (err) { toast.error(getErrorMessage(err) || "فشل تحديث البيانات"); } 
    finally { setIsUpdating(false); }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/schools/${deleteModal.id}`);
      toast.success("تم حذف المدرسة بنجاح");
      setDeleteModal({ show: false, id: null, name: '' });
      // إغلاق نافذة التفاصيل إذا كانت المدرسة المحذوفة هي المعروضة حالياً
      if (selectedSchool?.id === deleteModal.id) { setSelectedSchool(null); setIsEditing(false); }
      fetchSchools();
    } catch (err) { toast.error(getErrorMessage(err) || "فشل في حذف المدرسة. قد يكون هناك بيانات مرتبطة بها."); } 
    finally { setIsDeleting(false); }
  };

  const copyToClipboard = (text) => {
    if (!text) return; navigator.clipboard.writeText(text); toast.success("تم النسخ إلى الحافظة بنجاح");
  };

  return (
    <div className="w-full font-sans" dir="rtl">
      <div className={`transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 pb-10 px-4 md:px-0">

          <SchoolsHeader onBack={onBack} />

          <SchoolsSearchStats 
            totalCount={totalCount} searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
            clearSearch={clearSearch} setShowAddModal={setShowAddModal} 
          />

          <SchoolsGrid 
            loading={loading} schools={schools} filteredSchools={filteredSchools} 
            visibleCount={visibleCount} searchTerm={searchTerm} clearSearch={clearSearch} 
            handleLoadMore={handleLoadMore} setShowAddModal={setShowAddModal} 
            setSelectedSchool={setSelectedSchool} 
          />

        </div>
      </div>

      <SchoolsModals 
        showAddModal={showAddModal} setShowAddModal={setShowAddModal} isSaving={isSaving} error={error} setError={setError} formErrors={formErrors} setFormErrors={setFormErrors} newSchool={newSchool} handleNewSchoolChange={handleNewSchoolChange} handleAddSchool={handleAddSchool}
        selectedSchool={selectedSchool} setSelectedSchool={setSelectedSchool} isEditing={isEditing} setIsEditing={setIsEditing} handleStartEdit={handleStartEdit} editForm={editForm} setEditForm={setEditForm} isUpdating={isUpdating} handleUpdateSchool={handleUpdateSchool}
        deleteModal={deleteModal} setDeleteModal={setDeleteModal} isDeleting={isDeleting} confirmDelete={confirmDelete}
        successCredentials={successCredentials} setSuccessCredentials={setSuccessCredentials} copyToClipboard={copyToClipboard}
      />
    </div>
  );
}