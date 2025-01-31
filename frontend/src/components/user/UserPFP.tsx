interface UserPFPProps {
  url: string | null;
  onClick: () => void;
}

export default function UserPFP({ url, onClick }: UserPFPProps) {
  return (
    <div
      className="h-10 w-10 cursor-pointer rounded-full df bg-hover-transition hover:bg-accent-gray"
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
