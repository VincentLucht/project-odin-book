import { DBCommunityFlair } from '@/interface/dbSchema';

interface SelectFlairProps {
  flair: DBCommunityFlair;
  onClick: () => void;
  isCurrentlyActive: boolean;
  className?: string;
}

export default function SelectFlair({
  flair,
  onClick,
  isCurrentlyActive,
  className,
}: SelectFlairProps) {
  return (
    <div
      className={`rounded-full px-2 py-[6px] ${isCurrentlyActive ? 'border-2 border-white/40' : ''}`}
    >
      <div
        onClick={() => onClick()}
        className={`w-fit cursor-pointer select-none gap-1 rounded-full px-2 text-sm transition-transform df
          hover:scale-105 active:scale-95 ${className} `}
        style={{ backgroundColor: flair.color, color: flair.textColor }}
      >
        <span>{flair.name}</span>

        <span>{flair.emoji && flair.emoji}</span>
      </div>
    </div>
  );
}
