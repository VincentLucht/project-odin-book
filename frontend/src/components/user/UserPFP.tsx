interface UserPFPProps {
  url: string | null;
  onClick: () => void;
  classname?: string;
}

export default function UserPFP({ url, onClick, classname }: UserPFPProps) {
  return (
    <button className={`bg-hover-transition ${classname}`} onClick={() => onClick()}>
      <img
        src={`${url ? url : '/user.svg'}`}
        alt="User profile picture"
        className="h-8 w-8 rounded-full border object-cover"
      />
    </button>
  );
}
