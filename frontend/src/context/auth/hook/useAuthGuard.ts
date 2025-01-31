import { useEffect } from 'react';
import useAuth from '@/context/auth/hook/useAuth';
import { useNavigate } from 'react-router-dom';

export default function useAuthGuard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      throw new Error('User is not authenticated');
    }
  }, [user, token, navigate]);

  return { user: user!, token: token! };
}
