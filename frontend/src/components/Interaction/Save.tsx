import { Bookmark as SaveComponent } from 'lucide-react';

interface SaveProps {
  isSaved: boolean;
}

export default function Save({ isSaved }: SaveProps) {
  return (
    <button>
      <div>
        <SaveComponent />
      </div>
    </button>
  );
}
