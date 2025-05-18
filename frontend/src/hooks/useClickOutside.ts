import { useEffect, useRef } from 'react';

export default function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  closeFunction: () => void,
  ignoredElementRef?: React.RefObject<HTMLElement>,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isInMainRef = ref.current?.contains(event.target as Node);

      // Only check ignored ref if provided
      const isInIgnoredRef =
        ignoredElementRef?.current?.contains(event.target as Node) ?? false;

      if (!isInMainRef && !isInIgnoredRef) {
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
