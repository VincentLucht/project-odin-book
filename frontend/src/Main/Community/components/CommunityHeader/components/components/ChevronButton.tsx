import { ChevronDownIcon } from 'lucide-react';

interface ChevronButtonProps {
  text: string;
  customFunc: () => void;
  className?: string;
}

export default function ChevronButton({
  text,
  customFunc,
  className,
}: ChevronButtonProps) {
  return (
    <button
      className={`min-h-[32px] w-fit gap-1 rounded-full pl-3 pr-2 df bg-transition-hover ${className}`}
      onClick={customFunc}
    >
      <span className="text-sm">{text}</span>

      <ChevronDownIcon className="h-4 w-4 shrink-0" />
    </button>
  );
}
