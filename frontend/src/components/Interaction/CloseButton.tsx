interface CloseButtonProps {
  className?: string;
  classNameSvg?: string;
  customFunc: () => void;
}

export default function CloseButton({
  className,
  classNameSvg,
  customFunc,
}: CloseButtonProps) {
  return (
    <button
      className={`h-8 w-8 rounded-full p-1 transition-transform df normal-bg-transition active:scale-95
        ${className}`}
      onClick={customFunc}
    >
      <img
        src="/x-close.svg"
        alt="Close button"
        className={`h-[22px] w-[22px] ${classNameSvg}`}
      />
    </button>
  );
}
