interface UserPFPProps {
  url: string | null;
  onClick: () => void;
  classname?: string;
}

export default function UserPFP({ url, onClick, classname }: UserPFPProps) {
  return (
    <div
      className={`h-10 w-10 cursor-pointer rounded-full df bg-hover-transition hover:bg-accent-gray
        ${classname}`}
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
