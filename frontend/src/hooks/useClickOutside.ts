import { useEffect, useRef } from 'react';

export default function useClickOutside(
  closeFunction: () => void,
  ignoredElementRef?: React.RefObject<HTMLElement>,
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !ignoredElementRef?.current?.contains(event.target as Node)
      ) {
        closeFunction();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeFunction, ignoredElementRef]);

  return ref;
}
