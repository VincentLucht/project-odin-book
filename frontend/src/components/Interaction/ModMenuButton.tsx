import { ShieldIcon } from 'lucide-react';

interface ModMenuButtonProps {
  onClick: () => void;
}

export default function ModMenuButton({ onClick }: ModMenuButtonProps) {
  return (
    <button
      className="h-8 rounded-full px-1 hover:bg-hover-gray active:bg-active-gray sm:px-[10px]"
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <ShieldIcon className="h-6 w-6" />
    </button>
  );
}
