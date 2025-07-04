import { useNavigate } from 'react-router-dom';

export default function Logo() {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer select-none gap-[6px] df"
      onClick={() => navigate('/', { replace: true })}
    >
      <img
        loading="eager"
        src="/logo.webp"
        alt="reddnir logo"
        className="max-h-[40px] min-w-[40px]"
      />

      <h1 className="hidden text-3xl font-bold md:block">reddnir</h1>
    </div>
  );
}
