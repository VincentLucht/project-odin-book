import { Location, NavigateFunction } from 'react-router-dom';

import { PlusIcon } from 'lucide-react';

import handleCreatePostClick from '@/Header/components/CreateButton/util/handleCreatePostClick';

interface CreateButtonProps {
  location: Location<any>;
  navigate: NavigateFunction;
}

export default function CreateButton({ location, navigate }: CreateButtonProps) {
  return (
    <div
      className="flex-shrink-0 bg-hover-transition"
      onClick={() => handleCreatePostClick(location.pathname, navigate)}
    >
      <PlusIcon className="h-8 w-8" />
    </div>
  );
}
