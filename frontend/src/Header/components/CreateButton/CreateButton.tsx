import { useNavigate } from 'react-router-dom';

export default function CreateButton() {
  const navigate = useNavigate();

  return (
    <div className="df bg-hover-transition" onClick={() => navigate('/create')}>
      <img
        src="/plus.svg"
        alt="User profile picture"
        className="h-8 w-8 rounded-full"
      />
    </div>
  );
}
