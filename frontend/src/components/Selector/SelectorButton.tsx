interface SelectorButtonProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

export default function SelectorButton({
  name,
  isActive,
  onClick,
}: SelectorButtonProps) {
  return (
    <button
      className={`rounded-full px-[14px] ${isActive ? 'normal-bg-transition' : 'bg-transition-hover'}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
}
