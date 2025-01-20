import { useState, useEffect, useCallback, useMemo, createContext } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface TokenUser extends JwtPayload {
  iat: number;
  exp: number;
}

interface AuthContextType {
  login: (newToken: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
  token: string | null;
  user: TokenUser | null;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: any }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem('reddnir-jwt') !== null,
  );

  const [user, setUser] = useState<TokenUser | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('reddnir-jwt'),
  );
  const navigate = useNavigate();

  const login = useCallback(
    (newToken: string) => {
      setIsLoggedIn(true);
      setUser(jwtDecode(newToken));
      setToken(newToken);
      localStorage.setItem('reddnir-jwt', newToken);
      navigate('/');
    },
    [navigate],
  );

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('reddnir-jwt');
    navigate('/');
  }, [navigate]);

  const contextValue = useMemo(
    () => ({
      login,
      logout,
      isLoggedIn,
      token,
      user,
    }),
    [login, logout, isLoggedIn, token, user],
  );

  // Check token expiration every 5 minutes
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token) {
        try {
          const decodedToken = jwtDecode<TokenUser>(token);
          setUser(decodedToken);
        } catch (error) {
          toast.error('Authentication error, please log in again');
          logout();
        }
      } else {
        logout();
      }
    };

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 300000); // ? 5 minutes

    return () => clearInterval(interval);
  }, [token, logout]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
