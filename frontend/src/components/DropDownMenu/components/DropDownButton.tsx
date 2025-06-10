import { useNavigate } from 'react-router-dom';

interface DropdownButtonProps {
  text: string;
  icon?: React.ReactNode;
  src?: string;
  alt?: string;
  route?: string;
  show: boolean;
  setterFunc?: React.Dispatch<React.SetStateAction<string | null>>;
  customFunc?: () => void;
  size?: 'normal' | 'large';
  subText?: string;
  imgClassName?: string;
  isSelected?: boolean;
  className?: string;
  classNameText?: string;
}

export default function DropdownButton({
  text,
  icon,
  src,
  alt,
  route,
  show,
  setterFunc,
  customFunc,
  size = 'normal',
  subText,
  imgClassName,
  isSelected = false,
  className = '',
  classNameText = 'whitespace-nowrap',
}: DropdownButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      className={`text-mds flex w-full items-center gap-2 rounded-md px-4 py-2 font-light
        dropdown-btn-transition ${size === 'normal' ? 'h-[48px]' : 'h-[64px]'} ${className}
        ${show ? 'cursor-pointer' : 'cursor-default'} ${isSelected && 'bg-hover-gray'}`}
      onClick={() => {
        if (show && route && setterFunc) {
          setterFunc(null);
          navigate(route);
          return;
        }
        if (show && customFunc) {
          customFunc();
        }
        if (show && setterFunc) {
          setterFunc(null);
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {icon && <div className="h-[32px] w-[32px] df">{icon}</div>}

      {src && (
        <div className="h-[32px] w-[32px] flex-shrink-0 df">
          <img src={src} alt={alt} className={`${imgClassName} h-6 w-6 object-cover`} />
        </div>
      )}

      {subText ? (
        <div>
          <div className="-mt-[2px] mb-[2px] break-all leading-tight">{text}</div>

          <div className="text-start text-xs leading-none text-gray-secondary">
            {subText}
          </div>
        </div>
      ) : (
        <div className={`${classNameText}`}>{text}</div>
      )}
    </button>
  );
}
