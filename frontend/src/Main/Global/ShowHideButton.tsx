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
      className={`h-8 rounded-full px-3 text-sm font-semibold transition-colors interaction-button-wrapper
        hover:bg-hover-gray active:bg-accent-gray ${className}`}
      onClick={onClick}
    >
      {show ? 'Hide' : 'Show'} {label}
    </button>
  );
}
