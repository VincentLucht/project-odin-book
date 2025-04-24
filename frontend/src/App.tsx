import { useState } from 'react';

import Header from '@/Header/Header';
import Homepage from '@/Main/Pages/Homepage/Homepage';
import Sidebar from '@/Sidebar/Sidebar';

// TODO: Remove component?
export default function App() {
  const [search, setSearch] = useState('');

  return (
    <div className="mx-auto flex h-dvh flex-col">
      <Header search={search} setSearch={setSearch} />

      <div className="grid flex-1 grid-cols-[270px_auto]">
        <Sidebar />

        <Homepage />
      </div>
    </div>
  );
}
