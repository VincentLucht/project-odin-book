import { useState, useRef, useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';

import FlairSetting from '@/Main/Community/components/ModTools/components/CommunitySettings/components/components/FlairSetting';
import Separator from '@/components/Separator';
import ModalConfirm from '@/components/Modal/global/ModalConfirm';
import LogoLoading from '@/components/Lazy/Logo/LogoLoading';

import { deleteCommunityFlair } from '@/Main/Community/components/ModTools/components/CommunitySettings/api/communityFlairAPI';

import { DBCommunityFlair } from '@/interface/dbSchema';
import { Pagination } from '@/interface/backendTypes';
import { FlairEditPanel } from '@/Main/Community/components/ModTools/components/CommunitySettings/components/CommunityFlairSettings';

interface FlairOverviewProps {
  flairType: 'user' | 'post';
  editPanel: FlairEditPanel;
  setEditPanel: React.Dispatch<React.SetStateAction<FlairEditPanel>>;
  token: string | null;
  communityId: string;
  flairs: DBCommunityFlair[];
  pagination: Pagination;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  loadMore: (cursorId: string) => void;
  setFlairs: (flairId: string) => void;
}

export default function FlairOverview({
  flairType,
  editPanel,
  setEditPanel,
  token,
  communityId,
  flairs,
  pagination,
  submitting,
  setSubmitting,
  loading,
  loadMore,
  setFlairs,
}: FlairOverviewProps) {
  const [deletionModal, setDeletionModal] = useState({
    show: false,
    flairId: '',
  });
  const virtuosoRef = useRef(null);

  const onDelete = () => {
    setSubmitting(true);

    void deleteCommunityFlair(
      token,
      {
        community_id: communityId,
        community_flair_id: deletionModal.flairId,
      },
      {
        loading: 'Deleting flair...',
        success: 'Successfully deleted flair',
        error: 'Failed to delete flair',
      },
    ).then((success) => {
      setTimeout(() => setSubmitting(false), 200);

      if (!success) return;
      setDeletionModal({ show: false, flairId: '' });
      setFlairs(deletionModal.flairId);
    });
  };

  const ItemRenderer = useCallback(
    (index: number) => {
      const flair = flairs[index];
      if (!flair) return null;

      return (
        <div data-flair-id={flair.id}>
          <FlairSetting
            flair={{ ...flair }}
            className="my-4"
            key={flair.id}
            onDelete={() => setDeletionModal({ show: true, flairId: flair.id })}
            onOpenEdit={() =>
              setEditPanel((prev) => ({
                show: true,
                mode: 'edit',
                flair,
                count: prev.count,
              }))
            }
          />
        </div>
      );
    },
    [flairs, setEditPanel],
  );

  return (
    <div>
      <div className="mb-3 mt-8 flex items-center justify-between">
        <div className="text-xs font-semibold">FLAIR PREVIEW</div>

        <div className="text-xs">Available Flairs: {editPanel.count}/700</div>
      </div>

      <Separator />

      {flairs.length > 0 ? (
        <>
          <Virtuoso
            ref={virtuosoRef}
            data={flairs}
            totalCount={flairs.length}
            itemContent={(index) => ItemRenderer(index)}
            overscan={200}
            useWindowScroll
            scrollerRef={() => window}
            computeItemKey={(index) => flairs[index]?.id || index.toString()}
            endReached={() => {
              if (pagination.hasMore && pagination.nextCursor && !loading) {
                loadMore(pagination.nextCursor);
              }
            }}
          />

          {loading && <LogoLoading className="mt-4" />}
        </>
      ) : loading ? (
        <LogoLoading className="mt-4" />
      ) : (
        <div className="mt-4">
          No {flairType} flairs exist yet. Add on to get started!
        </div>
      )}

      <ModalConfirm
        show={deletionModal.show}
        headerName="Delete community flair?"
        onClose={() => setDeletionModal({ show: false, flairId: '' })}
        onConfirm={onDelete}
        loading={submitting}
        modalClassName="w-[400px]"
        description="Warning: This action is irreversible."
        buttonWrapperClassName="mt-6"
        confirmButtonName="Delete"
      />
    </div>
  );
}
