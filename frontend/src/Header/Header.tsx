import Logo from '@/Header/components/Logo/Logo';
import InputWithImg from '@/components/InputWithImg';
import UserButton from '@/Header/components/UserButton/UserButton';

interface HeaderProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function Header({ search, setSearch }: HeaderProps) {
  return (
    <header className="grid max-h-[56px] min-h-[56px] grid-cols-[30%_40%_30%] border border-b-0 px-4 py-2">
      <div className="flex justify-start">
        <Logo />
      </div>

      <InputWithImg
        value={search}
        setterFunc={setSearch}
        src="/magnify.svg"
        alt="magnifying glass"
        placeholder="Search Reddnir"
      />

      <div className="flex justify-end">
        <UserButton />
      </div>
    </header>
  );
}
