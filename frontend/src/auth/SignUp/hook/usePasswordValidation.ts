import { useEffect } from 'react';
import { ValidationError } from '@/interface/backendErrors';

interface UsePasswordValidationProps {
  password: string;
  confirmPassword: string;
  setErrors: React.Dispatch<React.SetStateAction<ValidationError>>;
}

export const usePasswordValidation = ({
  password,
  confirmPassword,
  setErrors,
}: UsePasswordValidationProps) => {
  useEffect(() => {
    if (confirmPassword.length > 0) {
      // Add delay to avoid showing error while typing
      const timer = setTimeout(() => {
        if (password !== confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            password: ' ',
            confirmpassword: 'Passwords do not match',
          }));
        } else {
          setErrors({});
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [password, confirmPassword, setErrors]);
};
