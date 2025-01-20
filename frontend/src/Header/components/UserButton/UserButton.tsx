import useAuth from '@/context/auth/hook/useAuth';

import LoginButton from '@/Header/components/LoginButton/LoginButton';
import DropDownMenu from '@/components/DropDownMenu';

export default function UserButton() {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <LoginButton />;
  }

  return <div>User Img</div>;
}
