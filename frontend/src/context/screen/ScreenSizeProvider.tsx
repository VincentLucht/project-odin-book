import { useState, useEffect, createContext } from 'react';

export const ScreenSizeContext = createContext({
  isMobile: false,
  isSmallScreen: false,
  isDesktop: true,
});

export default function ScreenSizeProvider({ children }: { children: any }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1280,
  );
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1280);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const mobile = currentWidth < 768;
      const smallScreen = currentWidth >= 768 && currentWidth < 1280;
      const desktop = currentWidth >= 1280;

      setIsMobile(mobile);
      setIsSmallScreen(smallScreen);
      setIsDesktop(desktop);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ScreenSizeContext.Provider value={{ isMobile, isSmallScreen, isDesktop }}>
      {children}
    </ScreenSizeContext.Provider>
  );
}
