import { useEffect } from 'react';

export default function useFocusLastPosition(
  ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement>,
) {
  useEffect(() => {
    const { current } = ref;
    if (current) {
      const { value } = current;
      current.focus();
      current.setSelectionRange(value.length, value.length);
    }
  }, [ref]);
}
