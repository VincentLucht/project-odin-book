import { ValidationError } from '@/interface/backendErrors';
import handleLogin from '@/auth/Login/util/handleLogin';

interface LoginAsGuestButtonProps {
  setErrors: React.Dispatch<React.SetStateAction<ValidationError>>;
  loginAuth: (newToken: string) => void;
}

export default function LoginAsGuestButton({
  setErrors,
  loginAuth,
}: LoginAsGuestButtonProps) {
  return (
    <button
      className="relative h-[52px] w-full rounded-full border-2 border-green-200 bg-green-50
        text-green-700 transition-all duration-200 ease-in-out df hover:border-green-300
        hover:bg-green-100 active:scale-95 active:bg-green-200"
      onClick={(e) => {
        e.preventDefault();
        handleLogin('guest', 'pass123', setErrors, loginAuth);
      }}
    >
      <img
        src="userKey.svg"
        alt="Login as Guest logo"
        className="absolute left-4 top-1/2 h-[26px] w-[26px] -translate-y-1/2 transform"
      />
      <div className="font-semibold">Continue as Guest</div>
    </button>
  );
}
