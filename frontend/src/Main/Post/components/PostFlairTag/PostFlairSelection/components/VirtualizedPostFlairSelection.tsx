import { useState, useCallback, useMemo } from 'react';

import { Virtuoso } from 'react-virtuoso';
import SelectFlair from '@/Main/Post/components/PostFlairTag/PostFlairSelection/components/SelectFlair';
import EndMessageHandler from '@/Main/Global/EndMessageHandler';

import { Pagination } from '@/interface/backendTypes';
import { DBCommunityFlair } from '@/interface/dbSchema';

interface VirtualizedPostFlairSelectionProps {
  flairs: DBCommunityFlair[];
  loading: boolean;
  loadMore: (cursorId: string, isInitialFetch?: boolean) => void;
  pagination: Pagination;
  activePostFlairId: string | null;
  onSelect: (flair: DBCommunityFlair) => void;
  onDelete: () => void;
  noResultsMessage?: string;
  searchTerm?: string;
}

export default function VirtualizedPostFlairSelection({
  flairs,
  loading,
  loadMore,
  pagination,
  activePostFlairId,
  onSelect,
  onDelete,
  noResultsMessage,
  searchTerm = '',
}: VirtualizedPostFlairSelectionProps) {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const removeFlair = useMemo(
    () => ({
      id: 'inactive',
      community_id: '',
      textColor: '',
      name: 'No post flair',
      color: '',
      emoji: '',
      is_assignable_to_posts: true,
      is_assignable_to_users: true,
    }),
    [],
  );

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return flairs;
    return flairs.filter((flair) => {
      if (flair.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      if (flair?.emoji?.includes(searchTerm)) {
        return true;
      }
      return false;
    });
  }, [flairs, searchTerm]);

  const ItemRenderer = useCallback(
    (index: number) => {
      const flair = filteredItems[index];
      if (!flair) return null;

      return (
        <SelectFlair
          flair={flair}
          key={flair.id}
          onClick={() => onSelect(flair)}
          isCurrentlyActive={flair.id === activePostFlairId}
        />
      );
    },
    [filteredItems, activePostFlairId, onSelect],
  );

  return (
    <div className="flex-1 flex-col gap-1 overscroll-contain">
      {filteredItems.length !== 0 && (
        <SelectFlair
          flair={removeFlair}
          onClick={onDelete}
          isCurrentlyActive={!activePostFlairId}
        />
      )}

      <div
        className={`${filteredItems.length ? 'h-[40dvh] max-h-[200px] min-h-[50px]' : ''}`}
      >
        <Virtuoso
          data={filteredItems}
          totalCount={filteredItems.length}
          itemContent={(index) => ItemRenderer(index)}
          overscan={200}
          computeItemKey={(index) => {
            if (index === 0) return 'remove-flair';
            return filteredItems[index]?.id || index.toString();
          }}
          endReached={() => {
            if (!loading && pagination.hasMore) {
              loadMore(pagination.nextCursor);
            }
          }}
          atBottomStateChange={(bottom) => setIsAtBottom(bottom)}
        />
      </div>

      {isAtBottom && (
        <EndMessageHandler
          loading={loading}
          hasMorePages={pagination.hasMore}
          dataLength={filteredItems.length}
          noResultsMessage={
            noResultsMessage ?? 'No flairs available in this community.'
          }
          endMessageClassName="!p-0"
          noResultsClassName="!p-0"
        />
      )}
    </div>
  );
}
