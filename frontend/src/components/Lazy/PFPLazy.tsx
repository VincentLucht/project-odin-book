interface PFPLazyProps {
  className?: string;
}

export default function PFPLazy({ className }: PFPLazyProps) {
  return <div className={`skeleton h-6 w-6 rounded-full ${className}`}></div>;
}
