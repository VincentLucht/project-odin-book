import { useState } from 'react';

import MagnifyingGlass from '@/components/Icon/MagnifyingGlass';
import CloseButton from '@/components/Interaction/CloseButton';

interface SearchFieldProps {
  id: string;
  value: string;
  setValue: (value: string) => void;
  onClose: () => void;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
  disabled?: boolean;
}

export default function SearchField({
  id,
  value,
  setValue,
  onClose,
  placeholder = 'Search...',
  className = '',
  autoComplete = 'off',
}: SearchFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={() => document.getElementById(id)?.focus()}
      className={`flex items-center rounded-full px-4 bg-accent-gray
        ${isFocused ? 'outline outline-2 outline-blue-500' : ''}`}
    >
      <MagnifyingGlass />

      <input
        type="text"
        name={id}
        id={id}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-full py-[10px] pl-2 bg-accent-gray focus:outline-none ${className}`}
      />

      {value && (
        <CloseButton
          customFunc={onClose}
          className="!min-h-8 !min-w-8"
          classNameSvg="close-with-circle"
        />
      )}
    </form>
  );
}
