import React, { useState, useEffect } from 'react';
import { authAPI } from '../../../../services/api';
import { toast } from 'react-hot-toast';

import { parseJwtSafely } from './components/CourtStaffLoginHelpers';
import { CourtStaffHeader, CourtStaffFooter } from './components/CourtStaffLayout';
import CourtStaffLoginForm from './components/CourtStaffLoginForm';
import CourtStaffChangePasswordForm from './components/CourtStaffChangePasswordForm';
import CourtStaffSuccessTransition from './components/CourtStaffSuccessTransition';

export function LoginScreen({ onLogin }) {
  const [step, setStep] = useState('login');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const [userFieldName] = useState(() => 'usr_' + Math.random().toString(36).substring(2, 9));
  const [pwdFieldName] = useState(() => 'pwd_' + Math.random().toString(36).substring(2, 9));

  // ✅ حل مشكلة الـ Reload: قراءة التوكن المؤقت
  useEffect(() => {
    if (sessionStorage.getItem('force_change_password') === 'true' && sessionStorage.getItem('wesal_temp_staff_token')) {
      setStep('change_password');
      setPassword('');
      setError('يرجى تغيير كلمة المرور المؤقتة قبل الدخول للداشبورد');
    } else {
      sessionStorage.removeItem('wesal_staff_token');
      sessionStorage.removeItem('wesal_temp_staff_token');
      sessionStorage.removeItem('wesal_staff_user_data');
      sessionStorage.removeItem('wesal_staff_user_role');
      sessionStorage.removeItem('wesal_staff_current_screen');
      sessionStorage.removeItem('force_change_password');
      sessionStorage.removeItem('wesal_user_data');
      sessionStorage.removeItem('wesal_token');
    }
  }, []);

  const validateLoginForm = () => {
    let errors = {};
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!username.trim() || !emailRegex.test(username)) {
      errors.username = "يرجى إدخال بريد إلكتروني وظيفي صحيح";
      isValid = false;
    }
    if (!password.trim()) {
      errors.password = "يرجى إدخال كلمة المرور";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true); setError(''); setFormErrors({});
    
    // تنظيف أعمق
    sessionStorage.removeItem('wesal_staff_token');
    sessionStorage.removeItem('wesal_temp_staff_token');
    sessionStorage.removeItem('force_change_password');

    try {
      const response = await authAPI.loginCourtStaff({ email: username.trim(), password: password.trim() });

      if (response.data && response.data.token) {
        const payload = parseJwtSafely(response.data.token);
        let isTempPassword = false;
        let tokenRole = 'employee'; 

        if (payload) {
          if (payload.tmp_pwd === "True" || payload.tmp_pwd === true || payload.tmp_pwd === "true") {
            isTempPassword = true;
          }
          if (payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
             tokenRole = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          }
        }

        if (isTempPassword) {
          // ✅ حفظ التوكن في مفتاح مخفي لمنع تجاوز الشاشة عند الـ Reload
          sessionStorage.setItem('force_change_password', 'true');
          sessionStorage.setItem('wesal_temp_staff_token', response.data.token); 
          setStep('change_password');
          toast('يجب تأمين حسابك بكلمة مرور جديدة قبل الدخول', { icon: '🔒', duration: 4000 });
        } else {
          sessionStorage.setItem('wesal_staff_token', response.data.token);
          
          let finalRole = tokenRole;
          if (response.data.user) {
            sessionStorage.setItem('wesal_staff_user_data', JSON.stringify(response.data.user));
            if(response.data.user.role) finalRole = response.data.user.role;
          }
          sessionStorage.setItem('wesal_staff_user_role', finalRole); 
          
          toast.success('تم تسجيل الدخول بنجاح!');
          onLogin(finalRole);
        }
      } else {
        setError('فشل تسجيل الدخول: لم يتم استلام رمز الوصول');
      }
    } catch (err) {
      console.error("Login Error:", err);
      sessionStorage.removeItem('wesal_staff_token');
      sessionStorage.removeItem('wesal_temp_staff_token');

      if (err.response) {
        const errorMsg = err.response.data?.detail || err.response.data?.title || "";
        if (err.response.status === 403 && (errorMsg.toLowerCase().includes("temporary password") || errorMsg.includes("تغيير كلمة المرور"))) {
          setStep('change_password');
          setError('');
          toast('يجب تأمين حسابك بكلمة مرور جديدة قبل الدخول', { icon: '🔒', duration: 4000 });
        } else if (err.response.status === 401) {
          setError('بيانات الاعتماد غير صالحة (تحقق من البريد الإلكتروني وكلمة المرور)');
        } else if (err.response.status === 404) {
          setError('هذا المستخدم غير مسجل في النظام كموظف');
        } else if (err.response.status === 500) {
          setError('خطأ داخلي في الخادم');
        } else {
          setError(`حدث خطأ: ${errorMsg || err.response.status}`);
        }
      } else if (err.code === 'ERR_NETWORK') {
        setError('فشل الاتصال بالخادم. تأكد من تشغيل النظام الخلفي');
      } else {
        setError('حدث خطأ غير متوقع');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validatePasswordChange = () => {
    let errors = {};
    let isValid = true;
    if (!password.trim()) { errors.currentPassword = "يرجى إدخال كلمة المرور الحالية"; isValid = false; }
    if (!newPassword.trim() || newPassword.length < 6) { errors.newPassword = "يجب أن تتكون كلمة المرور من 6 خانات على الأقل"; isValid = false; }
    if (!confirmPassword.trim() || newPassword !== confirmPassword) { errors.confirmPassword = "كلمتا المرور غير متطابقتين"; isValid = false; }
    setFormErrors(errors);
    return isValid;
  };

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    if (!validatePasswordChange()) return;

    setIsLoading(true); setError(""); setFormErrors({});

    // ✅ نقل التوكن المؤقت ليتم استخدامه في طلب الـ API
    const tempToken = sessionStorage.getItem('wesal_temp_staff_token');
    if (tempToken) sessionStorage.setItem('wesal_staff_token', tempToken);

    try {
      await authAPI.changePassword({ oldPassword: password, newPassword: newPassword });
      
      toast.success("تم تأمين الحساب بنجاح! يرجى تسجيل الدخول بالبيانات الجديدة.");
      
      sessionStorage.removeItem("force_change_password");
      sessionStorage.removeItem("wesal_temp_staff_token");
      sessionStorage.removeItem("wesal_staff_token"); 
      
      setStep('success_transition');
      setTimeout(() => {
        setStep('login');
        setPassword(''); setNewPassword(''); setConfirmPassword('');
      }, 2000);

    } catch (err) {
      sessionStorage.removeItem("wesal_staff_token"); // مسحه في حالة الخطأ
      const validationErrors = err.response?.data?.errors;
      let errorMessage = "فشل في تغيير كلمة المرور.";

      if (validationErrors) {
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors.map(errItem => errItem.description || "خطأ في الشروط").join(" - ");
        } else {
          errorMessage = Object.values(validationErrors).flat().join(" - ");
        }
      } else {
        errorMessage = err.response?.data?.detail || err.response?.data?.title || errorMessage;
      }

      setError(errorMessage);
      toast.error("حدث خطأ أثناء المحاولة.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      step === 'login' ? handleLogin(e) : handleChangePassword(e);
    }
  };

  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    if (formErrors[fieldName]) {
        setFormErrors(prev => ({...prev, [fieldName]: null}));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      dir="rtl"
      style={{ fontFamily: '"Times New Roman", "Traditional Arabic", serif', background: '#F5F5F5' }}
    >
      <div className="w-full max-w-[460px]">
        
        <CourtStaffHeader />

        {step === 'login' && (
          <CourtStaffLoginForm 
            username={username} setUsername={setUsername} password={password} setPassword={setPassword}
            showPassword={showPassword} setShowPassword={setShowPassword} isLoading={isLoading} error={error} formErrors={formErrors}
            handleInputChange={handleInputChange} handleKeyPress={handleKeyPress} handleLogin={handleLogin}
            userFieldName={userFieldName} pwdFieldName={pwdFieldName}
          />
        )}

        {step === 'change_password' && (
          <CourtStaffChangePasswordForm 
            password={password} setPassword={setPassword} newPassword={newPassword} setNewPassword={setNewPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            showPassword={showPassword} setShowPassword={setShowPassword} showNewPassword={showNewPassword} setShowNewPassword={setShowNewPassword}
            isLoading={isLoading} error={error} formErrors={formErrors} handleInputChange={handleInputChange} handleKeyPress={handleKeyPress} handleChangePassword={handleChangePassword}
          />
        )}

        {step === 'success_transition' && <CourtStaffSuccessTransition />}

        <CourtStaffFooter />
      </div>
    </div>
  );
}