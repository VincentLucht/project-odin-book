import { ValidationError } from '@/interface/backendErrors';

export default function validateSignup(
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  setErrors: React.Dispatch<React.SetStateAction<ValidationError>>,
) {
  let errors: { [key: string]: string } = {};

  if (!username) {
    errors = { ...errors, username: 'Username is required' };
  }
  if (!email) {
    errors = { ...errors, email: 'Email is required' };
  }
  if (!password) {
    errors = { ...errors, password: 'Password is required' };
  }
  if (!confirmPassword) {
    errors = { ...errors, confirmpassword: 'Confirm Password is required' };
  }

  const passwordMatch = password === confirmPassword;
  if (!passwordMatch) {
    errors = {
      ...errors,
      password: ' ',
      confirmpassword: 'Passwords do not match',
    };
  }

  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return false;
  }

  return true;
}
