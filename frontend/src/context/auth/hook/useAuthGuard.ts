import { useEffect } from 'react';
import useAuth from '@/context/auth/hook/useAuth';
import { useNavigate } from 'react-router-dom';
import notLoggedInError from '@/util/notLoggedInError';

export default function useAuthGuard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      notLoggedInError();
      navigate('/login');
    }
  }, [user, token, navigate]);

  return { user, token, logout };
}
