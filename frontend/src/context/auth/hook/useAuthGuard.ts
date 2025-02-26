import { useEffect } from 'react';
import useAuth from '@/context/auth/hook/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function useAuthGuard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      toast.error('You are not logged in');
      navigate('/login');
    }
  }, [user, token, navigate]);

  return { user: user!, token: token! };
}
