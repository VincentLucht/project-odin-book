interface UserPFPProps {
  url: string | null;
  onClick: () => void;
}

export default function UserPFP({ url, onClick }: UserPFPProps) {
  return (
    <div
      className="hover:bg-accent-gray bg-hover-transition h-10 w-10 rounded-full df"
      onClick={() => onClick()}
    >
      <img
        src={`${url ? url : '/user.svg'}`}
        alt="User profile picture"
        className="h-8 w-8 rounded-full border"
      />
    </div>
  );
}
