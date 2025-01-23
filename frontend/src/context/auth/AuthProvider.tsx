import { useState, useEffect, useCallback, useMemo, createContext } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export interface TokenUser extends JwtPayload {
  cake_day: string | null;
  create_at: string;
  description: string | null;
  display_name: string | null;
  email: string;
  iat: number;
  exp: number;
  id: string;
  password: null;
  profile_picture_url: string | null;
  username: string;
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
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('reddnir-jwt'),
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => token !== null);
  const [user, setUser] = useState<TokenUser | null>(() => {
    if (token) {
      try {
        return jwtDecode(token);
      } catch {
        localStorage.removeItem('reddnir-jwt');
        return null;
      }
    }
    return null;
  });

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

          if (decodedToken.exp * 1000 < Date.now()) {
            toast.error('Session expired, please log in again');
            logout();
            return;
          }
        } catch (error) {
          toast.error('Authentication error, please log in again');
          logout();
        }
      } else {
        logout();
      }
    };

    if (isLoggedIn) {
      checkTokenExpiration();
    }

    const interval = setInterval(checkTokenExpiration, 300000); // ? 5 minutes

    return () => clearInterval(interval);
  }, [token, isLoggedIn, logout]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
