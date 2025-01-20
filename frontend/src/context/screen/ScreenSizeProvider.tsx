import { useState, useEffect, createContext } from 'react';

export const ScreenSizeContext = createContext(false);

export default function ScreenSizeProvider({ children }: { children: any }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ScreenSizeContext.Provider value={isMobile}>{children}</ScreenSizeContext.Provider>
  );
}
