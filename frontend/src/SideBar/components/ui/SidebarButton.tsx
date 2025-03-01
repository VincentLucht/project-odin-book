interface SidebarButtonProps {
  navigate: () => void;
  buttonName: string;
  icon?: React.ReactNode;
  src?: string;
  alt?: string;
  imgClassName?: string;
}

export default function SidebarButton({
  navigate,
  buttonName,
  icon,
  src,
  alt,
  imgClassName = 'h-7 w-7',
}: SidebarButtonProps) {
  return (
    <button onClick={navigate} className="sidebar-btn">
      {icon && icon}
      {src && <img className={imgClassName} src={src} alt={alt} />}

      <div>{buttonName}</div>
    </button>
  );
}
