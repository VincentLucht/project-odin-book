import { useContext } from 'react';
import { ScreenSizeContext } from '@/context/screen/ScreenSizeProvider';

export default function useGetScreenSize() {
  return useContext(ScreenSizeContext);
}
