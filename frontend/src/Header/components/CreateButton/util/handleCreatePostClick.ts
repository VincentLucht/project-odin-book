import { NavigateFunction } from 'react-router-dom';

const handleCreatePostClick = (pathname: string, navigate: NavigateFunction) => {
  // Check if on community page
  const communityMatch = pathname.match(/\/r\/([^]+)/);

  if (communityMatch) {
    const communityName = communityMatch[1];
    navigate(`/create?community=${communityName}`);
  } else {
    navigate('/create');
  }
};

export default handleCreatePostClick;
