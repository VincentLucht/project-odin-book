interface ToggleButtonProps {
  buttonName: string;
  onClick: () => void;
  isActive: boolean;
  className?: string;
  defaultStyling?: boolean;
}

export default function ToggleButton({
  buttonName,
  className,
  isActive,
  onClick,
}: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${className} ${isActive && 'bg-accent-gray'}`}
    >
      {buttonName}
    </button>
  );
}
