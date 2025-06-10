interface ToggleButtonProps {
  show: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}

export default function ShowHideButton({
  show,
  onClick,
  label,
  className,
}: ToggleButtonProps) {
  return (
    <button
      className={`h-8 rounded-full px-3 text-sm font-semibold bg-transition-hover ${className}`}
      onClick={onClick}
    >
      {show ? 'Hide' : 'Show'} {label}
    </button>
  );
}
