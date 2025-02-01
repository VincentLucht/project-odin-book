interface IsCommunityMemberProps {
  userMember: {
    user_id: string;
  }[];
  userId: string;
}

export default function IsCommunityMember({
  userMember,
  userId,
}: IsCommunityMemberProps) {
  let isMember = false;
  if (userMember.length && userMember[0].user_id === userId) {
    isMember = true;
  }

  return (
    <div>
      {isMember ? (
        <button>Joined</button>
      ) : (
        <button className="h-6 max-w-[50px] text-[13px] !font-semibold df prm-button-blue">
          Join
        </button>
      )}
    </div>
  );
}
