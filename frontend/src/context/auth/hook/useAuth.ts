import { useContext } from 'react';
import { AuthContext } from '@/context/auth/AuthProvider';
import { TokenUser } from '@/context/auth/AuthProvider';

interface AuthenticatedUser {
  isLoggedIn: true;
  user: TokenUser;
  token: string;
  login: (newToken: string) => void;
  logout: () => void;
}

interface UnauthenticatedUser {
  isLoggedIn: false;
  user: null;
  token: null;
  login: (newToken: string) => void;
  logout: () => void;
}

type Auth = AuthenticatedUser | UnauthenticatedUser;

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context as Auth;
}
