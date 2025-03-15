import { useSpring, animated } from '@react-spring/web';

import RuleTab from '@/Main/CreatePost/components/CreatePostSidebar/components/RuleTab';
import RuleTabSkeleton from '@/Main/CreatePost/components/CreatePostSidebar/components/RuleTabSkeleton';

import { DBCommunityRule } from '@/interface/dbSchema';

interface CreatePostSidebarProps {
  communityName: string | undefined;
  rules: DBCommunityRule[] | undefined;
  isLoading: boolean;
}

export default function CreatePostSidebar({
  communityName,
  rules,
  isLoading,
}: CreatePostSidebarProps) {
  const contentAnimation = useSpring({
    opacity: 1,
    config: {
      mass: 1.2,
      tension: 300,
      friction: 20,
      clamp: true,
    },
  });

  const loadingAnimation = useSpring({
    opacity: isLoading ? 1 : 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 20,
      clamp: true,
    },
  });

  if (!isLoading && !communityName) {
    return null;
  }

  return (
    <div className="sidebar rounded-2xl bg-zinc-950 p-4 text-gray-400">
      {isLoading ? (
        <animated.div style={loadingAnimation}>
          <div className="mb-2 h-6 w-40 animate-pulse rounded bg-zinc-800"></div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <RuleTabSkeleton key={i} />
            ))}
          </div>
        </animated.div>
      ) : (
        <animated.div style={contentAnimation}>
          <h2 className="mb-2 font-semibold">r/{communityName} Rules:</h2>
          <div className="flex flex-col gap-3">
            {!rules?.length ? (
              <div>This community has no rules</div>
            ) : (
              rules?.map((rule) => <RuleTab key={rule.id} rule={rule} />)
            )}
          </div>
        </animated.div>
      )}
    </div>
  );
}
