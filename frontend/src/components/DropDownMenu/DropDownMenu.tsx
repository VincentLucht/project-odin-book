import { ReactElement } from 'react';
import useAuth from '@/context/auth/hook/useAuth';
import './css/dropdown.css';

interface DropdownMenuProps {
  children: ReactElement | ReactElement[];
  className?: string;
}

export default function DropdownMenu({ children, className }: DropdownMenuProps) {
  const { user } = useAuth();

  if (!user) return;

  return (
    <div
      className={`dropdown-menu-shadow absolute top-[58px] z-10 flex-col py-2 df bg-accent-gray
        ${className}`}
    >
      {children}
    </div>
  );
}
