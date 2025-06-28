import ToggleButton from '@/components/Interaction/ToggleButton';

export type MemberType = 'users' | 'moderators' | 'banned' | 'approved';

interface CommunityMembersApiFiltersProps {
  selectedMemberType: MemberType;
  setSelectedMemberType: React.Dispatch<React.SetStateAction<MemberType>>;
}

export default function CommunityMembersApiFilters({
  selectedMemberType,
  setSelectedMemberType,
}: CommunityMembersApiFiltersProps) {
  const isActive = (buttonName: string) => selectedMemberType === buttonName;

  const className = 'h-[46px] rounded-full px-[14px] bg-transition-hover font-semibold';

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-1">
        <ToggleButton
          buttonName="Users"
          onClick={() => setSelectedMemberType('users')}
          className={className}
          isActive={isActive('users')}
        />

        <ToggleButton
          buttonName="Moderators"
          onClick={() => setSelectedMemberType('moderators')}
          className={className}
          isActive={isActive('moderators')}
        />

        <ToggleButton
          buttonName="Banned Users"
          onClick={() => setSelectedMemberType('banned')}
          className={className}
          isActive={isActive('banned')}
        />

        <ToggleButton
          buttonName="Approved Users"
          onClick={() => setSelectedMemberType('approved')}
          className={className}
          isActive={isActive('approved')}
        />
      </div>
    </div>
  );
}
