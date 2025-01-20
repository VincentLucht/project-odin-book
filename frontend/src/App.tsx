import { useState } from 'react';

import Header from '@/Header/Header';
import Main from '@/Main/Main';
import Sidebar from '@/SideBar/Sidebar';

export default function App() {
  const [search, setSearch] = useState('');

  return (
    <div className="mx-auto flex h-dvh flex-col">
      <Header search={search} setSearch={setSearch} />

      <div className="grid flex-1 grid-cols-[270px_auto]">
        <Sidebar />

        <Main />
      </div>
    </div>
  );
}
