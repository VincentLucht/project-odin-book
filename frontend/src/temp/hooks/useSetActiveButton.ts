import { useEffect } from 'react';
import { Location } from 'react-router-dom';

export default function useSetActiveButton(
  location: Location,
  setActiveButton: React.Dispatch<React.SetStateAction<string>>,
) {
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveButton('Home');
    } else {
      setActiveButton('');
    }
  }, [location, setActiveButton]);
}
