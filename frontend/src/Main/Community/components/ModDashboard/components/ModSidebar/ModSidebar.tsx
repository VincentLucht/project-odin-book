import { useNavigate } from "react-router-dom";

import SidebarButton from "@/Sidebar/components/ui/SidebarButton";

export default function ModSidebar() {
  const navigate = useNavigate();

  return (
    <nav className="h-[calc(100dvh-56px)] w-[320px] overflow-y-scroll border-r py-6 pr-4 text-sm bg-gray">
      <div className="flex-col py-4 df">
        <SidebarButton  />
      </div>
    </nav>
  );
}
