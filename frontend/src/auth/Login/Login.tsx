import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/context/auth/hook/useAuth';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';

import handleLogin from '@/auth/Login/util/handleLogin';

import LoginAsGuestButton from '@/auth/Login/components/LoginAsGuestButton';
import LoginAsAdminButton from '@/auth/Login/components/LoginAsAdminButton';
import InputWithError from '@/components/InputWithError';
import LoadingButton from '@/components/LoadingButton';
import SVG_PATHS from '@/auth/Login/svg/SVG_PATHS';

import { ValidationError } from '@/interface/backendErrors';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<ValidationError>({});

  const navigate = useNavigate();
  const { login: loginAuth } = useAuth();
  const { isMobile } = useGetScreenSize();

  return (
    <div className="h-dvh flex-col df">
      <form
        className={`w-full max-w-[500px] rounded-xl border ${isMobile ? 'px-4' : 'px-[80px]'} max-h-[90dvh]
          overflow-y-auto py-4`}
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

          <LoadingButton
            text="Login"
            isLoading={isLoading}
            func={() =>
              handleLogin(username, password, setErrors, loginAuth, setIsLoading)
            }
          />

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

            <LoginAsGuestButton setErrors={setErrors} loginAuth={loginAuth} />

            <LoginAsAdminButton setErrors={setErrors} loginAuth={loginAuth} />
          </div>
        </div>
      </form>
    </div>
  );
}
