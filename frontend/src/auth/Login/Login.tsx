import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/context/auth/hook/useAuth';
import useIsMobile from '@/context/screen/hook/useIsMobile';

import login from '@/auth/Login/api/handleLogin';

import LoginAsGuestButton from '@/auth/Login/components/LoginAsGuestButton';
import LoginAsAdminButton from '@/auth/Login/components/LoginAsAdminButton';
import InputWithError from '@/components/InputWithError';
import SVG_PATHS from '@/auth/Login/svg/SVG_PATHS';
import '@/css/spinner.css';

import { ValidationError, ResponseError } from '@/interface/backendErrors';
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<ValidationError>({});

  const navigate = useNavigate();
  const { login: loginAuth } = useAuth();
  const isMobile = useIsMobile();

  const handleLogin = (username: string, password: string) => {
    if (!username) {
      setErrors((prev) => ({ ...prev, username: 'Username is required' }));
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
    }
    if (!username || !password) return;

    login(username, password)
      .then((response) => {
        toast.success('Successfully logged in');
        loginAuth(response.token);
      })
      .catch((response: ResponseError) => {
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
  };

  return (
    <div className="h-dvh flex-col df">
      <form
        className={`w-full max-w-[500px] rounded-xl border ${isMobile ? 'px-4' : 'px-[80px]'} py-4`}
      >
        <h2 className="mb-6 w-full text-center h2">Login</h2>

        <div className="flex-col gap-6 df">
          <InputWithError
            value={username}
            setterFunc={setUsername}
            path={SVG_PATHS.user}
            alt="Username logo"
            placeholder="Username"
            className="h-[52px] w-full"
            errors={errors}
            setErrors={setErrors}
          />

          <InputWithError
            value={password}
            setterFunc={setPassword}
            path={SVG_PATHS.lock}
            alt="Password logo"
            placeholder="Password"
            className="h-[52px] w-full"
            errors={errors}
            setErrors={setErrors}
          />

          <button
            className="mt-1 h-[52px] w-full df prm-button-blue"
            onClick={(e) => {
              e.preventDefault();
              handleLogin(username, password);
            }}
            type="submit"
          >
            Login
          </button>

          <div className="w-full text-center">
            New To Reddnir?
            <span
              onClick={() => navigate('/sign-up')}
              className="ml-1 cursor-pointer font-bold text-blue-400 transition-colors hover:text-blue-500"
            >
              Sign Up
            </span>
          </div>

          <div className="mb-2 flex w-full flex-col gap-3">
            <div className="my-1 grid w-full grid-cols-[40%_20%_40%] items-center">
              <hr className="border-t border-gray-600" />
              <span className="text-center font-medium text-gray-500">OR</span>
              <hr className="border-t border-gray-600" />
            </div>

            <LoginAsGuestButton handleLogin={handleLogin} />

            <LoginAsAdminButton handleLogin={handleLogin} />
          </div>
        </div>
      </form>
    </div>
  );
}
