
import React from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

export const useValidation = () => {
  const validateField = (value: string, rules: ValidationRules, fieldName: string): ValidationError | null => {
    if (rules.required && (!value || value.trim() === '')) {
      return { field: fieldName, message: `${fieldName} обязательно для заполнения` };
    }

    if (rules.minLength && value.length < rules.minLength) {
      return { field: fieldName, message: `${fieldName} должно содержать минимум ${rules.minLength} символов` };
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return { field: fieldName, message: `${fieldName} должно содержать максимум ${rules.maxLength} символов` };
    }

    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return { field: fieldName, message: 'Введите корректный email адрес' };
    }

    if (rules.phone && value && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(value)) {
      return { field: fieldName, message: 'Введите корректный номер телефона' };
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return { field: fieldName, message: `${fieldName} имеет неверный формат` };
    }

    return null;
  };

  const validateForm = (formData: Record<string, string>, validationRules: Record<string, ValidationRules>): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    Object.entries(validationRules).forEach(([fieldName, rules]) => {
      const value = formData[fieldName] || '';
      const error = validateField(value, rules, fieldName);
      if (error) {
        errors.push(error);
      }
    });

    return errors;
  };

  return { validateField, validateForm };
};

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  required
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-light text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-2xl border transition-all duration-300 font-light backdrop-blur-xl ${
          error 
            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-gray-200 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
        } focus:outline-none`}
      />
      {error && (
        <p className="text-red-500 text-xs font-light animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
