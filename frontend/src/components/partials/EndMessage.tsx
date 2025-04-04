interface EndMessageProps {
  className?: string;
}

export default function EndMessage({ className }: EndMessageProps) {
  return (
    <div className={`${className} pb-5 pt-3 text-center text-lg font-semibold`}>
      You&apos;ve reached the end!
    </div>
  );
}
