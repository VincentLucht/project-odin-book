import { useNavigate } from 'react-router-dom';

interface DropDownButtonProps {
  text: string;
  src: string;
  alt: string;
  route: string;
  setterFunc: React.Dispatch<React.SetStateAction<string | null>>;
  size?: 'normal' | 'large';
  subText?: string;
  imgClassName?: string;
}

export default function DropDownButton({
  text,
  src,
  alt,
  route,
  setterFunc,
  size = 'normal',
  subText,
  imgClassName,
}: DropDownButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      className={`text-mds dropdown-btn-transition flex w-full items-center gap-2 rounded-md px-4 py-2
        font-light ${size === 'normal' ? 'h-[48px]' : 'h-[64px]'}`}
      onClick={() => {
        setterFunc(null);
        navigate(route);
      }}
    >
      <div className="h-[32px] w-[32px] df">
        <img src={src} alt={alt} className={`${imgClassName} h-6 w-6`} />
      </div>

      {subText ? (
        <div>
          <div className="-mt-[2px] mb-[2px] leading-tight">{text}</div>
          <div className="text-gray-secondary text-start text-xs leading-none">
            {subText}
          </div>
        </div>
      ) : (
        <div>{text}</div>
      )}
    </button>
  );
}
