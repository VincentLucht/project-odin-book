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
}: DropdownButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      className={`text-mds flex w-full items-center gap-2 rounded-md px-4 py-2 font-light
        dropdown-btn-transition ${size === 'normal' ? 'h-[48px]' : 'h-[64px]'}
        ${show ? 'cursor-pointer' : 'cursor-default'} ${isSelected && 'bg-hover-gray'}`}
      onClick={() => {
        if (show && route && setterFunc) {
          setterFunc(null);
          navigate(route);
          return;
        }
        if (show && setterFunc) {
          setterFunc(null);
        }
        if (show && customFunc) {
          customFunc();
        }
      }}
    >
      {icon && <div className="h-[32px] w-[32px] df">{icon}</div>}

      {src && (
        <div className="h-[32px] w-[32px] df">
          <img src={src} alt={alt} className={`${imgClassName} h-6 w-6`} />
        </div>
      )}

      {subText ? (
        <div>
          <div className="-mt-[2px] mb-[2px] leading-tight">{text}</div>
          <div className="text-start text-xs leading-none text-gray-secondary">
            {subText}
          </div>
        </div>
      ) : (
        <div className="whitespace-nowrap">{text}</div>
      )}
    </button>
  );
}
