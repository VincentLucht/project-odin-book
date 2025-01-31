import { useNavigate } from 'react-router-dom';

export default function UserNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex-col gap-4 df">
      <div className="flex-col df">
        <img src="/logo.png" alt="Reddnir logo" className="w-20 rotate-[135deg]" />
        <div className="-mt-[5.5px] w-[60px] border-b-2"></div>
      </div>

      <h2 className="text-2xl font-bold">
        Sorry, nobody on Reddnir goes by that name.
      </h2>

      <span className="text-sm text-gray-secondary">
        This account may have been banned or the username is incorrect
      </span>

      <button className="h-8 w-full prm-button-blue" onClick={() => navigate('/')}>
        Return
      </button>
    </div>
  );
}
