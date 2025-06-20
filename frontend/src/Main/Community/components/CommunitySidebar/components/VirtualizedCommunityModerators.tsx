import { useState, useEffect, useCallback, useRef } from 'react';

import { Virtuoso } from 'react-virtuoso';
import ModeratorCard from '@/Main/Community/components/CommunitySidebar/components/ModeratorCard';
import EndMessageHandler from '@/Main/Global/EndMessageHandler';
import Separator from '@/components/Separator';

import { fetchModerators } from '@/Main/Community/components/ModTools/api/communityModerationAPI';

import { FetchedModerator } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { Pagination } from '@/interface/backendTypes';

interface VirtualizedCommunityModeratorsProps {
  show: boolean;
  communityId: string;
  moderators: FetchedModerator[];
  setModerators: React.Dispatch<React.SetStateAction<FetchedModerator[]>>;
}

export default function VirtualizedCommunityModerators({
  show,
  communityId,
  moderators,
  setModerators,
}: VirtualizedCommunityModeratorsProps) {
  const [pagination, setPagination] = useState<Pagination>({
    hasMore: true,
    nextCursor: '',
  });
  const [loading, setLoading] = useState(false);
  const hasOpened = useRef(false);

  const loadMore = useCallback(
    (cursorId: string, isInitialFetch = false) => {
      setLoading(true);

      void fetchModerators(communityId, cursorId, (moderators, pagination) => {
        isInitialFetch
          ? setModerators(moderators)
          : setModerators((prev) => [...prev, ...moderators]);

        setPagination(pagination);
        setLoading(false);
      });
    },
    [communityId, setModerators],
  );

  const ItemRenderer = useCallback(
    (index: number) => {
      const moderator = moderators[index];
      if (!moderator) return null;

      return <ModeratorCard moderator={moderator} />;
    },
    [moderators],
  );

  useEffect(() => {
    if (show) {
      hasOpened.current = true;
    }
  }, [show]);

  useEffect(() => {
    if (hasOpened.current) {
      loadMore('', true);
    }
  }, [loadMore]);

  return (
    <div className="min-h-[300px]">
      <Separator />

      <div className="flex items-center justify-between px-1 py-3 font-semibold">
        <div>USERNAME</div>

        <div className="mr-5">JOINED</div>
      </div>

      <Virtuoso
        data={moderators}
        itemContent={(index) => ItemRenderer(index)}
        overscan={200}
        endReached={() => {
          if (pagination.hasMore && !loading) {
            loadMore(pagination.nextCursor);
          }
        }}
        components={{
          Footer: () => (
            <EndMessageHandler
              loading={loading}
              hasMorePages={pagination.hasMore}
              dataLength={moderators.length}
              endMessageClassName="mb-[0px]"
            />
          ),
        }}
      />
    </div>
  );
}
