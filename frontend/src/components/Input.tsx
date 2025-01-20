interface InputProps {
  value: string;
  setterFunc: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  styling?: boolean;
}

export default function Input({
  value,
  setterFunc,
  className,
  styling = true,
}: InputProps) {
  return (
    // TODO: Add accessibility
    <input
      className={`${className} ${styling ? 'h-[36px] rounded-full px-4' : ''}`}
      type="text"
      value={value}
      onChange={(e) => setterFunc(e.target.value)}
    />
  );
}
