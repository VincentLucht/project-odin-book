import { useLocation, useNavigate } from 'react-router-dom';

export default function CreateButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    // Check if on community page
    const communityMatch = location.pathname.match(/\/r\/([^]+)/);

    if (communityMatch) {
      const communityName = communityMatch[1];
      navigate(`/create?community=${communityName}`);
    } else {
      navigate('/create');
    }
  };

  return (
    <div className="df bg-hover-transition" onClick={handleClick}>
      <img
        src="/plus.svg"
        alt="User profile picture"
        className="h-8 w-8 rounded-full"
      />
    </div>
  );
}
