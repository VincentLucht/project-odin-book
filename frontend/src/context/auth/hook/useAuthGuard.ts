import { useEffect } from 'react';
import useAuth from '@/context/auth/hook/useAuth';
import { useNavigate } from 'react-router-dom';

export default function useAuthGuard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  return user;
}
