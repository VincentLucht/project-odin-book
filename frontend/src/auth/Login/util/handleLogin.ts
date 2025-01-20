import login from '@/auth/Login/api/login';
import { toast } from 'react-toastify';

import { ResponseError, ValidationError } from '@/interface/backendErrors';

export default function handleLogin(
  username: string,
  password: string,
  setErrors: React.Dispatch<React.SetStateAction<ValidationError>>,
  loginAuth: (newToken: string) => void,
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
) {
  setErrors({});
  setIsLoading && setIsLoading(true);

  if (!username) {
    setErrors((prev) => ({ ...prev, username: 'Username is required' }));
    setIsLoading && setIsLoading(false);
  }
  if (!password) {
    setErrors((prev) => ({ ...prev, password: 'Password is required' }));
    setIsLoading && setIsLoading(false);
  }
  if (!username || !password) return;

  login(username, password)
    .then((response) => {
      toast.success('Successfully logged in');
      loginAuth(response.token);
    })
    .catch((response: ResponseError) => {
      setIsLoading && setIsLoading(false);
      if (response.errors) {
        const errors: { [key: string]: string } = {};
        response.errors.forEach((error) => {
          errors[error.path] = error.msg;
        });
        setErrors(errors);
      }

      if (response.message === 'Load failed') {
        setErrors({
          username: ' ',
          password: 'Connection error, please try again later',
        });
      } else if (response.message === 'Authentication failed') {
        setErrors({
          username: ' ',
          password: 'Invalid username or password',
        });
      } else {
        // other error
        setErrors({
          username: ' ',
          password: 'Unknown error occurred, please try again',
        });
      }
    });
}
