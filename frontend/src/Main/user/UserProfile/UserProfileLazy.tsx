import { useMemo } from 'react';

import PostLazy from '@/Main/Post/components/Loading/PostLazy';
import CommentOverviewLazy from '@/Main/CommentOverview/CommentOverviewLazy';
import SidebarLazy from '@/components/Lazy/SidebarLazy';
import LazyCompartment from '@/components/Lazy/LazyCompartment';
import PFPLazy from '@/components/Lazy/PFPLazy';

export default function UserProfileLazy() {
  const { usernameLength, displayNameLength } = useMemo(() => {
    return {
      usernameLength: Math.floor(Math.random() * (170 - 20 + 1)) + 20,
      displayNameLength: Math.floor(Math.random() * (340 - 20 + 1)) + 20,
    };
  }, []);

  const generateRandomContent = () => {
    const content = [];
    for (let i = 0; i < 15; i++) {
      const type = Math.random() > 0.5 ? 'post' : 'comment';
      content.push({ type, key: `${type}-${i}` });
    }
    return content.sort(() => Math.random() - 0.5);
  };

  const mixedContent = generateRandomContent();
  const hasDisplayName = Math.random() > 0.3;

  return (
    <div className="h-[100dvh + 56px] p-4">
      <div className="center-main">
        <div className="center-main-content">
          <div className="w-full min-w-0">
            <div className="flex gap-2">
              <PFPLazy className="!h-24 !w-24 rounded-full" />

              <div className="flex-col df">
                {/* Display Name and username */}
                {hasDisplayName ? (
                  <div className="flex flex-col gap-2">
                    <LazyCompartment width={displayNameLength} height={24} />
                    <LazyCompartment width={usernameLength} height={20} />
                  </div>
                ) : (
                  <LazyCompartment width={usernameLength} height={24} />
                )}
              </div>
            </div>

            {/* API filters */}
            <div className="mb-2 mt-4 flex gap-5">
              <LazyCompartment className="mb-3 ml-3 mr-2" width={180} height={20} />
              <LazyCompartment width={50} height={20} />
            </div>

            {mixedContent.map((item) =>
              item.type === 'post' ? (
                <PostLazy key={item.key} mode="overview" />
              ) : (
                <CommentOverviewLazy key={item.key} />
              ),
            )}
          </div>

          <SidebarLazy min={200} max={300} />
        </div>
      </div>
    </div>
  );
}
