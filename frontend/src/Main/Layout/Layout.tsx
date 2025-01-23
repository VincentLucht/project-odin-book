import { useState } from 'react';

import Header from '@/Header/Header';
import Sidebar from '@/SideBar/Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [search, setSearch] = useState('');

  return (
    <div className="mx-auto flex h-dvh flex-col">
      <Header search={search} setSearch={setSearch} />
      <div className="grid flex-1 grid-cols-[270px_auto]">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
