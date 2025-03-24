import formatCount from '@/components/sidebar/DisplayMemberCount.tsx/formatCount';

interface DisplayMemberCountProps {
  memberCount: number;
}

export default function DisplayMemberCount({ memberCount }: DisplayMemberCountProps) {
  return (
    <div className="flex flex-col">
      <span className="font-semibold">{formatCount(memberCount)}</span>

      <span className="-mt-[2px] text-sm font-light">Members</span>
    </div>
  );
}
