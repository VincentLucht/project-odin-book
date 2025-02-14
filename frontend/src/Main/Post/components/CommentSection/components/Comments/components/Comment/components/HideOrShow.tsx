import { CircleMinusIcon, CirclePlusIcon } from 'lucide-react';

interface HideOrShowProps {
  hide: boolean;
  setHide: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HideOrShow({ hide, setHide }: HideOrShowProps) {
  const iconProps = {
    className: 'h-[18px] cursor-pointer transition-all hover:scale-110 active:scale-95',
  };

  return (
    <div className="df">
      {hide ? (
        <CirclePlusIcon {...iconProps} onClick={() => setHide(false)} />
      ) : (
        <CircleMinusIcon {...iconProps} onClick={() => setHide(true)} />
      )}
    </div>
  );
}
