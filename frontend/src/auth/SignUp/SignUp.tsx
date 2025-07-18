import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/context/auth/hook/useAuth';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';
import { useValidation } from '@/auth/SignUp/hook/usePasswordValidation';

import signup from '@/auth/SignUp/api/signup';
import login from '@/auth/Login/api/login';
import validateSignup from '@/auth/SignUp/util/validateSignup';
import SVG_PATHS from '@/auth/Login/svg/SVG_PATHS';

import LoginAsGuestButton from '@/auth/Login/components/LoginAsGuestButton';
import LoginAsModButton from '@/auth/Login/components/LoginAsModButton';
import InputWithError from '@/components/InputWithError';
import LoadingButton from '@/components/LoadingButton';

import { ValidationError, ResponseError } from '@/interface/backendErrors';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const [errors, setErrors] = useState<ValidationError>({});

  const navigate = useNavigate();
  const { login: loginAuth } = useAuth();
  const { isMobile } = useGetScreenSize();
  useValidation({ username, password, confirmPassword, setErrors });

  const handleSignUp = (username: string, password: string) => {
    setIsLoading(true);
    setErrors({});

    if (!validateSignup(username, email, password, confirmPassword, setErrors)) {
      setIsLoading(false);
      return;
    }

    signup(username, email, password, confirmPassword)
      .then(() => {
        toast.success('Successfully signed in');

        const toastId = toast.loading('Logging in...');
        login(username, password)
          .then((response) => {
            toastUpdate(toastId, 'success', 'Successfully logged in');
            loginAuth(response.token);
          })
          .catch(() => {
            toastUpdate(
              toastId,
              'error',
              'An unknown error occurred while logging in, please try again',
            );
          });
      })
      .catch((response: ResponseError) => {
        setIsLoading(false);
        if (response.errors) {
          const errors: { [key: string]: string } = {};
          response.errors.forEach((error) => {
            errors[error.path] = error.msg;
          });
          setErrors(errors);
        }

        const defaultErrors = {
          username: ' ',
          email: ' ',
          password: ' ',
          confirmpassword: ' ',
        };

        if (response.message === 'Load failed') {
          defaultErrors.confirmpassword = 'Connection error, please try again later';
        } else if (response.message === 'Username already in use') {
          defaultErrors.username = response.message;
        } else if (response.message === 'Email already in use') {
          defaultErrors.email = response.message;
        } else {
          // Other errors
          defaultErrors.confirmpassword = 'Unknown error occurred, please try again';
        }

        setErrors(defaultErrors);
      });
  };

  useEffect(() => {
    if (!/^[a-zA-Z0-9_]+$/.test(username) && username.length > 0) {
      setErrors((prev) => ({
        ...prev,
        username: 'Username can only contain letters, numbers, and underscores',
      }));
    }

    if (username && username.length < 2) {
      setErrors((prev) => ({
        ...prev,
        username: 'Username has to be at least 2 characters long',
      }));
    }
  }, [username]);

  return (
    <div className="h-dvh flex-col df">
      <form
        className={`w-full max-w-[500px] rounded-xl border ${isMobile ? 'px-4' : 'px-[80px]'} max-h-[90dvh]
          overflow-y-auto py-4`}
      >
        <h2 className="mb-6 w-full text-center h2">Sign Up</h2>

        <div className="flex-col gap-6 df">
          {/* Username */}
          <InputWithError
            value={username}
            setterFunc={setUsername}
            path={SVG_PATHS.user}
            alt="Username logo"
            placeholder="Username"
            className="h-[52px] w-full"
            errors={errors}
            maxLength={20}
            setErrors={setErrors}
          />

          {/* Email */}
          <InputWithError
            value={email}
            setterFunc={setEmail}
            path={SVG_PATHS.email}
            alt="Email logo"
            placeholder="Email"
            className="h-[52px] w-full"
            errors={errors}
            maxLength={320}
            setErrors={setErrors}
          />

          {/* Password */}
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

          {/* Confirm Password */}
          <InputWithError
            value={confirmPassword}
            setterFunc={setConfirmPassword}
            path={SVG_PATHS.lockCheck}
            alt="Confirm password logo"
            placeholder="Confirm Password"
            className="h-[52px] w-full"
            errors={errors}
            setErrors={setErrors}
          />

          <LoadingButton
            text="Sign Up"
            isLoading={isLoading}
            func={() => !isLoading && handleSignUp(username, password)}
          />

          <div className="w-full text-center">
            Already have an account?
            <span
              onClick={() => navigate('/login')}
              className="ml-1 cursor-pointer font-bold text-blue-400 transition-colors hover:text-blue-500"
            >
              Log In
            </span>
          </div>

          <div className="mb-2 flex w-full flex-col gap-3">
            <div className="my-1 grid w-full grid-cols-[40%_20%_40%] items-center">
              <hr className="border-t border-gray-600" />
              <span className="text-center font-medium text-gray-500">OR</span>
              <hr className="border-t border-gray-600" />
            </div>

            <LoginAsGuestButton
              setErrors={setErrors}
              loginAuth={loginAuth}
              authLoading={authLoading}
              setAuthLoading={setAuthLoading}
            />

            <LoginAsModButton
              setErrors={setErrors}
              loginAuth={loginAuth}
              authLoading={authLoading}
              setAuthLoading={setAuthLoading}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
