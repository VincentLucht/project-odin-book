import { ReactElement, forwardRef } from 'react';
import useAuth from '@/context/auth/hook/useAuth';
import './css/dropdown.css';

interface DropdownMenuProps {
  children: ReactElement | ReactElement[];
  className?: string;
}

const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, className }, ref) => {
    const { user } = useAuth();
    if (!user) return null;

    return (
      <div
        ref={ref}
        className={`dropdown-menu-shadow absolute top-[58px] flex-col py-2 df bg-accent-gray ${className}`}
      >
        {children}
      </div>
    );
  },
);

DropdownMenu.displayName = 'DropdownMenu';
export default DropdownMenu;
