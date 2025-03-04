interface InputProps {
  value: string;
  setterFunc: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  maxLength?: number;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function Input({
  value,
  setterFunc,
  placeholder,
  maxLength,
  className,
  onFocus,
  onBlur,
}: InputProps) {
  return (
    <input
      className={`${className} h-12 rounded-2xl px-4 focus-blue`}
      value={value}
      placeholder={placeholder}
      onChange={(e) => setterFunc(e.target.value)}
      type="text"
      maxLength={maxLength}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}
