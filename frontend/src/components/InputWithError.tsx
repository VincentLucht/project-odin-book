import { ValidationError } from '@/interface/backendErrors';
import { useState, useRef, useEffect } from 'react';

interface SearchBarWithImgProps {
  value: string;
  setterFunc: React.Dispatch<React.SetStateAction<string>>;
  path: string;
  alt: string;
  placeholder: string;
  className?: string;
  imgClassName?: string;
  styling?: boolean;
  errors?: ValidationError;
  setErrors: React.Dispatch<React.SetStateAction<ValidationError>>;
}

export default function InputWithError({
  value,
  setterFunc,
  path,
  alt,
  placeholder,
  className = '',
  styling = true,
  errors,
  setErrors,
}: SearchBarWithImgProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target !== inputRef.current) {
      inputRef.current?.focus();
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsFocused(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const errorFieldName = placeholder.toLowerCase();
  const error = errors?.[errorFieldName];

  // Reset errors on value change
  useEffect(() => {
    setErrors({});
  }, [value, setErrors]);

  return (
    <div className="w-full">
      <div
        className={` ${className} ${styling ? 'h-[40px] gap-2 rounded-full bg-[rgb(30,30,30)] px-4 df' : ''}
          ${isFocused ? 'ring-2 ring-blue-500' : ''} ${error ? 'ring-2 ring-red-500' : ''}
          transition-all duration-200`}
        onClick={handleContainerClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <div className="df">
          <svg
            fill={`${error ? '#ef4444' : 'white'}`}
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            className={`${error && 'text-red-500'}`}
            aria-label={alt}
          >
            <path d={path} />
          </svg>
        </div>

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
      </div>

      {error ? (
        <div
          className="ml-5 mt-2 translate-y-0 transform text-red-500 opacity-100 transition-all duration-300
            ease-in-out"
        >
          {error}
        </div>
      ) : (
        <div className="ml-5 -translate-y-1 transform opacity-0 transition-all duration-300 ease-in-out"></div>
      )}
    </div>
  );
}
