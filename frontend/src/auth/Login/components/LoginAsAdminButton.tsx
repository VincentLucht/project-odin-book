import handleLogin from '@/auth/Login/util/handleLogin';
import { ValidationError } from '@/interface/backendErrors';

interface LoginAsAdminButtonProps {
  setErrors: React.Dispatch<React.SetStateAction<ValidationError>>;
  loginAuth: (newToken: string) => void;
}

export default function LoginAsAdminButton({
  setErrors,
  loginAuth,
}: LoginAsAdminButtonProps) {
  return (
    <button
      className="relative h-[52px] w-full rounded-full border-2 border-purple-200 bg-purple-50
        text-purple-700 transition-all duration-200 ease-in-out df hover:border-purple-300
        hover:bg-purple-100 active:scale-95 active:bg-purple-200"
      onClick={(e) => {
        e.preventDefault();
        handleLogin('guest_admin', 'adminpw', setErrors, loginAuth);
      }}
    >
      <img
        src="shieldAccount.svg"
        alt="Login as Admin logo"
        className="absolute left-4 top-1/2 h-[26px] w-[32px] -translate-y-1/2 transform"
      />
      <div className="font-semibold">Continue as Admin</div>
    </button>
  );
}
