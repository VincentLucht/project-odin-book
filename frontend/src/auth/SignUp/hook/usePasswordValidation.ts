import { useEffect } from 'react';
import { ValidationError } from '@/interface/backendErrors';

interface UsePasswordValidationProps {
  username: string;
  password: string;
  confirmPassword: string;
  setErrors: React.Dispatch<React.SetStateAction<ValidationError>>;
}

export const useValidation = ({
  username,
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
          setErrors((prev) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, confirmpassword, ...rest } = prev;
            return rest;
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [password, confirmPassword, setErrors]);

  useEffect(() => {
    if (username.includes(' ')) {
      setErrors((prev) => ({
        ...prev,
        username: 'Username can only contain letters, numbers, and underscores',
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        username: '',
      }));
    }
  }, [username, setErrors]);
};
