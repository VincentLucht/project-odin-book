import { useState, useEffect, createContext } from 'react';

export const ScreenSizeContext = createContext({
  isMobile: false,
  isSmallScreen: false,
});

export default function ScreenSizeProvider({ children }: { children: any }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1280,
  );

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setIsMobile(currentWidth < 768);
      setIsSmallScreen(currentWidth >= 768 && currentWidth < 1280);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ScreenSizeContext.Provider value={{ isMobile, isSmallScreen }}>
      {children}
    </ScreenSizeContext.Provider>
  );
}
