import { useState, useEffect } from 'react';
import { useTransition, animated } from '@react-spring/web';

import { CircleAlertIcon } from 'lucide-react';

import { CreationInfo } from '@/Main/CreatePost/components/SelectCommunity/api/getCreationInfo';
import { TokenUser } from '@/context/auth/AuthProvider';

interface MemberCheckProps {
  community: CreationInfo | null;
  user: TokenUser;
  isAllowedToPost: boolean;
  setIsAllowedToPost: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MemberCheck({
  community,
  user,
  isAllowedToPost,
  setIsAllowedToPost,
}: MemberCheckProps) {
  const [reason, setReason] = useState('');

  const isRestricted = community?.type === 'RESTRICTED';
  const isPrivate = community?.type === 'PRIVATE';
  const isMember = community?.user_communities?.[0]?.user_id === user.id;
  const membershipType = community?.user_communities?.[0]?.role;

  useEffect(() => {
    const checkPermissions = () => {
      let shouldAllow = true;
      let denialReason = '';

      if (isRestricted) {
        if (!isMember) {
          denialReason = 'You are not a member of this community';
          shouldAllow = false;
        } else if (membershipType !== 'CONTRIBUTOR') {
          denialReason = 'You are not a contributor in this community';
          shouldAllow = false;
        }
      }

      if (isPrivate) {
        if (!isMember) {
          denialReason = 'You are not a member of this private community';
          shouldAllow = false;
        } else if (!community?.allow_basic_user_posts && membershipType === 'BASIC') {
          denialReason = 'Basic users are not allowed to post in this community';
          shouldAllow = false;
        }
      }

      if (shouldAllow !== isAllowedToPost) {
        setIsAllowedToPost(shouldAllow);
      }

      if (!shouldAllow) {
        setReason(denialReason);
      }
    };

    checkPermissions();
  }, [
    community,
    user,
    membershipType,
    isMember,
    isAllowedToPost,
    isPrivate,
    isRestricted,
    setIsAllowedToPost,
  ]);

  const transitions = useTransition(!isAllowedToPost, {
    from: { opacity: 0, transform: 'translateY(-20px)', height: 0 },
    enter: { opacity: 1, transform: 'translateY(0)', height: 54 },
    leave: { opacity: 0, transform: 'translateY(-20px)', height: 0 },
    config: { mass: 1, tension: 200, friction: 26 },
  });

  return transitions(
    (styles, item) =>
      item && (
        <animated.div style={styles}>
          <div
            className="flex w-fit items-center gap-2 rounded-md border border-gray-600 p-3 text-sm
              text-gray-400"
          >
            <CircleAlertIcon className="h-7 w-7 fill-red-500 text-bg-gray" />
            <div>{reason}</div>
          </div>
        </animated.div>
      ),
  );
}
