import '@/components/Lazy/Logo/LogoLoading.css';

interface LogoLoadingProps {
  className?: string;
}

export default function LogoLoading({ className }: LogoLoadingProps) {
  return (
    <div className="df">
      <img
        className={`h-10 w-10 ${className ?? ''} spin-animation`}
        src="/logo.png"
        alt="Loading comments"
      />
    </div>
  );
}
