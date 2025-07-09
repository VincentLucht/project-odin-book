interface SidebarButtonProps {
  navigate: () => void;
  buttonName: string;
  className?: string;
  icon?: React.ReactNode;
  src?: string;
  alt?: string;
  imgClassName?: string;
}

export default function SidebarButton({
  navigate,
  buttonName,
  className,
  icon,
  src,
  alt,
  imgClassName = 'h-7 w-7',
}: SidebarButtonProps) {
  return (
    <button onClick={navigate} className={`gap-3 sidebar-btn ${className}`}>
      {icon && icon}
      {src && <img className={imgClassName} src={src} alt={alt} />}

      <div className="truncate">{buttonName}</div>
    </button>
  );
}
