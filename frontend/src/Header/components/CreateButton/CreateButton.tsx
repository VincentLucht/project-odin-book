import { useLocation, useNavigate } from 'react-router-dom';

import { PlusIcon } from 'lucide-react';

import handleCreatePostClick from '@/Header/components/CreateButton/util/handleCreatePostClick';

export default function CreateButton() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="flex-shrink-0 df bg-hover-transition"
      onClick={() => handleCreatePostClick(location.pathname, navigate)}
    >
      <PlusIcon className="h-8 w-8" />
    </div>
  );
}
