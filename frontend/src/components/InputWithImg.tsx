import { useState, useRef } from 'react';

interface SearchBarWithImgProps {
  value: string;
  setterFunc: React.Dispatch<React.SetStateAction<string>>;
  src: string;
  alt: string;
  placeholder: string;
  className?: string;
  imgClassName?: string;
  styling?: boolean;
  imgLocation?: 'left' | 'right';
}

export default function InputWithImg({
  value,
  setterFunc,
  src,
  alt,
  className = '',
  imgClassName = 'min-h-[26px] min-w-[26px]',
  styling = true,
  imgLocation = 'left',
  placeholder,
}: SearchBarWithImgProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = (e: React.MouseEvent) => {
    // Only focus if the click wasn't on the input itself
    if (e.target !== inputRef.current) {
      inputRef.current?.focus();
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Only blur if not focusing within the container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsFocused(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const imageElement = (
    <img
      src={src}
      alt={alt}
      className={`${imgClassName} ${isFocused ? 'opacity-90' : 'opacity-70'}`}
    />
  );

  return (
    <div
      className={` ${className}
        ${styling ? 'flex h-[40px] items-center gap-1 rounded-full bg-[rgb(30,30,30)] px-4' : ''}
        ${isFocused ? 'outline outline-2 outline-blue-500' : ''} transition-all duration-200`}
      onClick={handleContainerClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {imgLocation === 'left' && imageElement}

      <input
        ref={inputRef}
        className={
          'w-full flex-1 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none'
        }
        type="text"
        value={value}
        onChange={(e) => setterFunc(e.target.value)}
        placeholder={placeholder}
      />

      {imgLocation === 'right' && imageElement}
    </div>
  );
}
