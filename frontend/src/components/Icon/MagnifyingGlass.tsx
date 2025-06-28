interface MagnifyingGlassProps {
  className?: string;
}

export default function MagnifyingGlass({ className = '' }: MagnifyingGlassProps) {
  return (
    <img
      src="/magnify.svg"
      alt="magnifying glass"
      className={`min-h-[26px] min-w-[26px] opacity-70 ${className}`}
    />
  );
}
