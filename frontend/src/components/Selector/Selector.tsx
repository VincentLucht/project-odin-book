interface SelectorProps {
  children: React.ReactNode;
  className?: string;
}

export default function Selector({ children, className }: SelectorProps) {
  return <div className={`flex gap-2 py-2 ${className}`}>{children}</div>;
}
