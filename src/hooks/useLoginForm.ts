import { useState, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export interface LoginFormState {
  email: string;
  password: string;
  captchaInput: string;
}

export const useLoginForm = () => {
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormState>({
    email: '',
    password: '',
    captchaInput: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<LoginFormState>>({});
  const [captchaCode, setCaptchaCode] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear global and local errors on keystroke
    if (authError) clearError();
    if (customError) setCustomError(null);

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const setGeneratedCaptcha = useCallback((code: string) => {
    setCaptchaCode(code);
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<LoginFormState> = {};
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email address is required.';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required.';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    // Captcha validation
    if (!formData.captchaInput) {
      errors.captchaInput = 'Security challenge code is required.';
      isValid = false;
    } else if (formData.captchaInput.trim().toLowerCase() !== captchaCode.toLowerCase()) {
      errors.captchaInput = 'Code does not match. Please try again.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitLoading(true);
    setCustomError(null);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setCustomError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const autofillDemo = () => {
    setFormData({
      email: 'admin@teapos.com',
      password: 'admin123',
      captchaInput: '',
    });
    setFormErrors({});
    setCustomError(null);
  };

  return {
    formData,
    formErrors,
    isSubmitLoading,
    customError: customError || authError,
    handleInputChange,
    handleFormSubmit,
    setGeneratedCaptcha,
    autofillDemo,
    captchaCode,
  };
};
