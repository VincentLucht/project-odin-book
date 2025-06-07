interface SidebarLazyProps {
  min: number;
  max: number;
  className?: string;
}

export default function SidebarLazy({ min, max, className = '' }: SidebarLazyProps) {
  const randomHeight = Math.floor(Math.random() * (max - min + 1)) + min;

  return (
    <div
      className={`skeleton w-[300px] rounded-2xl ${className}`}
      style={{ height: `${randomHeight}px` }}
    ></div>
  );
}
