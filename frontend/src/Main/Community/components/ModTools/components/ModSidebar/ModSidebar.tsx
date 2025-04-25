import { useNavigate } from 'react-router-dom';

import SidebarButton from '@/Sidebar/components/ui/SidebarButton';

export default function ModSidebar() {
  const navigate = useNavigate();

  return (
    <nav className="h-[calc(100dvh)] w-[320px] overflow-y-scroll border-r py-6 text-sm bg-gray">
      <div className="flex-col py-4 df">
        <SidebarButton navigate={() => navigate('modmail')} buttonName="Mod Mail" />

        <SidebarButton navigate={() => navigate('settings')} buttonName="Settings" />
      </div>
    </nav>
  );
}
