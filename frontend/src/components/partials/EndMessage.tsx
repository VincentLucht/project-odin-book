interface EndMessageProps {
  message?: string;
  className?: string;
}

export default function EndMessage({
  message = "You've reached the end",
  className,
}: EndMessageProps) {
  return (
    <div className={`${className} pb-5 pt-3 text-center text-lg font-semibold`}>
      {message}
    </div>
  );
}
