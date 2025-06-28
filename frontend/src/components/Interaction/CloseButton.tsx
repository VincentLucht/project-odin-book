interface CloseButtonProps {
  className?: string;
  classNameSvg?: string;
  outline?: boolean;
  type?: 'button' | 'reset' | 'submit';
  customFunc: () => void;
}

export default function CloseButton({
  className,
  classNameSvg,
  outline = true,
  type = 'button',
  customFunc,
}: CloseButtonProps) {
  if (!outline) {
    return (
      <button
        className={`h-8 w-8 rounded-full p-1 transition-transform df hover:scale-[107%] active:scale-95
          ${className}`}
        onClick={customFunc}
      >
        <img
          src="/x-close-red.svg"
          alt="Close button"
          className={`h-10 w-10 ${classNameSvg}`}
        />
      </button>
    );
  }

  return (
    <button
      className={`h-8 w-8 rounded-full p-1 transition-transform df normal-bg-transition active:scale-95
        ${className}`}
      onClick={customFunc}
      type={type}
    >
      <img
        src="/x-close.svg"
        alt="Close button"
        className={`h-[22px] w-[22px] ${classNameSvg}`}
      />
    </button>
  );
}
