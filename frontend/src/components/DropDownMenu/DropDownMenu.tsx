import { ReactElement } from 'react';
import useAuth from '@/context/auth/hook/useAuth';

interface DropdownMenuProps {
  children: ReactElement | ReactElement[];
  className?: string;
}

export default function DropdownMenu({ children, className }: DropdownMenuProps) {
  const { user } = useAuth();

  if (!user) return;

  return (
    // TODO: Add box shadow
    <div className={`absolute top-[58px] flex-col py-2 df bg-accent-gray ${className}`}>
      {children}
    </div>
  );
}
