import { useContext } from 'react';
import { ScreenSizeContext } from '@/context/screen/ScreenSizeProvider';

export default function useIsMobile() {
  return useContext(ScreenSizeContext);
}
