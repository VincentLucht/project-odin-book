import { CircleIcon } from 'lucide-react';
import { CircleCheckBigIcon } from 'lucide-react';

interface ButtonWithImgAndCircleProps {
  icon: React.ReactNode;
  header: string;
  subText: string | React.ReactNode;
  isSelected: boolean;
  className?: string;
  onClick?: () => void;
}

export default function ButtonWithImgAndCircle({
  icon,
  header,
  subText,
  isSelected,
  className,
  onClick,
}: ButtonWithImgAndCircleProps) {
  return (
    <button
      className={`${className} ${isSelected && 'bg-accent-gray'} flex items-center gap-3 rounded-lg p-3
        bg-transition-hover`}
      onClick={() => onClick && onClick()}
    >
      {icon}

      <div className="flex-grow text-left">
        <div>{header}</div>

        <div className="text-xs text-gray-secondary">{subText}</div>
      </div>

      {!isSelected ? (
        <CircleIcon className="flex-shrink-0" />
      ) : (
        <CircleCheckBigIcon className="flex-shrink-0" />
      )}
    </button>
  );
}
