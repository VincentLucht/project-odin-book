import handleCreatePostClick from '@/Header/components/CreateButton/util/handleCreatePostClick';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CreateButton() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="df bg-hover-transition"
      onClick={() => handleCreatePostClick(location.pathname, navigate)}
    >
      <img
        src="/plus.svg"
        alt="User profile picture"
        className="h-8 w-8 rounded-full"
      />
    </div>
  );
}
