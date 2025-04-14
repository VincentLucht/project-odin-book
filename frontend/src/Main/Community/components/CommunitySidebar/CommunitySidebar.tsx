import DisplayCommunityType from '@/components/sidebar/DisplayCommunityType';
import DisplayCreationDate from '@/components/sidebar/DisplayCreationDate';
import DisplayMemberCount from '@/components/sidebar/DisplayMemberCount.tsx/DisplayMemberCount';
import Separator from '@/components/Separator';
import RuleTab from '@/Main/CreatePost/components/CreatePostSidebar/components/RuleTab';
import UserCard from '@/components/user/UserCard';
import { MailIcon } from 'lucide-react';

import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunity';
import { NavigateFunction } from 'react-router-dom';

interface CommunitySidebarProps {
  community: FetchedCommunity;
  navigate: NavigateFunction;
}

export default function CommunitySidebar({
  community,
  navigate,
}: CommunitySidebarProps) {
  return (
    <div className="!gap-0 overflow-y-auto rounded-md bg-neutral-950 px-4 py-2 pb-3 sidebar">
      <div className="font-medium">{community.name}</div>

      <div className="font-light">{community.description}</div>

      <div className="flex flex-col gap-1 py-2">
        <DisplayCreationDate creationDate={community.created_at} />
        <DisplayCommunityType communityType={community.type} />
      </div>

      <DisplayMemberCount memberCount={community.total_members} />

      <Separator className="my-4" />

      {community.community_rules.length && (
        <div>
          <h3 className="sidebar-subheading">RULES</h3>

          {community.community_rules.map((rule, index) => (
            <RuleTab rule={rule} key={index} />
          ))}
        </div>
      )}

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h3 className="sidebar-subheading">MODERATORS</h3>

        {/* TODO: Add this functionality */}
        <button className="gap-2 df sidebar-btn-stone">
          <MailIcon className="w-5" strokeWidth={1.7} />
          Message Mods
        </button>

        {community.community_moderators.map(({ is_active, user }, index) => {
          if (!is_active) return;

          const userFlair = user?.user_assigned_flair?.[0]?.community_flair;
          return (
            <UserCard
              key={index}
              profile_picture_url={user.profile_picture_url}
              username={user.username}
              navigate={navigate}
              {...(userFlair && {
                userFlair: {
                  name: userFlair.name,
                  emoji: userFlair.emoji,
                  textColor: userFlair.textColor,
                  color: userFlair.color,
                },
              })}
            />
          );
        })}

        {/* TODO: Add this functionality */}
        <button className="sidebar-btn-stone">View all moderators</button>
      </div>
    </div>
  );
}
