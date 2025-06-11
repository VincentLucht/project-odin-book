import { useState, useEffect, createContext } from 'react';

export const ScreenSizeContext = createContext({
  isSuperSmallScreen: false,
  isBelow550px: false,
  isMobile: false,
  isSmallScreen: false,
  isDesktop: true,
});

export default function ScreenSizeProvider({ children }: { children: any }) {
  const [isSuperSmallScreen, setIsSuperSmallScreen] = useState(
    window.innerWidth <= 500,
  );
  const [isBelow550px, setIsBelow550px] = useState(window.innerWidth <= 550);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1024,
  );
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1280);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;

      const superSmallScreen = currentWidth <= 500;
      const isBelow550px = currentWidth <= 550;
      const mobile = currentWidth < 768;
      const smallScreen = currentWidth >= 768 && currentWidth < 1024;
      const desktop = currentWidth >= 1280;

      setIsSuperSmallScreen(superSmallScreen);
      setIsBelow550px(isBelow550px);
      setIsMobile(mobile);
      setIsSmallScreen(smallScreen);
      setIsDesktop(desktop);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ScreenSizeContext.Provider
      value={{ isSuperSmallScreen, isBelow550px, isMobile, isSmallScreen, isDesktop }}
    >
      {children}
    </ScreenSizeContext.Provider>
  );
}
