import { useNavigate } from 'react-router-dom';

export default function LoginButton() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/login')} className="w-[82px] prm-button-blue">
      Login
    </button>
  );
}
