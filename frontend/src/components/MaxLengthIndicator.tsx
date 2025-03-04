interface MaxLengthIndicatorProps {
  length: number;
  maxLength: number;
  className?: string;
  onlySpan?: boolean;
}

export default function MaxLengthIndicator({
  length,
  maxLength,
  className,
  onlySpan = false,
}: MaxLengthIndicatorProps) {
  if (onlySpan) {
    return (
      <span className={`${className} mr-4 mt-1 text-sm`}>
        {length}/{maxLength}
      </span>
    );
  }

  return (
    <div className={`${className} mr-4 mt-1 flex items-center justify-end text-sm`}>
      <span>
        {length}/{maxLength}
      </span>
    </div>
  );
}
