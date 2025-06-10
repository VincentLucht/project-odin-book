interface MemberShipButtonProps {
  isMember: boolean;
  onClick: () => void;
  classNameMember?: string;
  classNameNotMember?: string;
}

export default function MemberShipButton({
  isMember,
  onClick,
  classNameMember,
  classNameNotMember,
}: MemberShipButtonProps) {
  return (
    <div className="transition-all">
      {isMember ? (
        <button
          className={`min-h-[38px] max-w-[65px] !px-10 !font-medium transparent-btn ${classNameMember}`}
          onClick={onClick}
        >
          Joined
        </button>
      ) : (
        <button
          className={`min-h-[38px] max-w-[50px] !px-7 !font-medium df prm-button-blue ${classNameNotMember}`}
          onClick={onClick}
        >
          Join
        </button>
      )}
    </div>
  );
}
