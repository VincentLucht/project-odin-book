import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';
import useModToolsContext from '@/Main/Community/components/ModTools/hooks/useModToolsContext';

import FlairOverview from '@/Main/Community/components/ModTools/components/CommunitySettings/components/components/FlairOverview';
import EditFlairPanel from '@/Main/Community/components/ModTools/components/CommunitySettings/components/components/EditFlairPanel';

import { fetchCommunityFlairs } from '@/Main/Community/components/ModTools/components/CommunitySettings/api/communityFlairAPI';
import {
  DEFAULT_FLAIR_POST,
  DEFAULT_FLAIR_USER,
} from '@/Main/Community/components/ModTools/components/CommunitySettings/components/components/DEFAULT_FLAIR';

import { ArrowLeftIcon } from 'lucide-react';
import { DBCommunityFlair } from '@/interface/dbSchema';
import { Pagination } from '@/interface/backendTypes';

export interface FlairEditPanel {
  show: boolean;
  mode: 'create' | 'edit' | null;
  flair: DBCommunityFlair;
  count: number;
}

interface CommunityFlairSettingsProps {
  flairType: 'user' | 'post';
}

export default function CommunityFlairSettings({
  flairType,
}: CommunityFlairSettingsProps) {
  const navigate = useNavigate();
  const { community } = useModToolsContext();
  const { token } = useAuthGuard();
  const DEFAULT_FLAIR = flairType === 'post' ? DEFAULT_FLAIR_POST : DEFAULT_FLAIR_USER;

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flairs, setFlairs] = useState<DBCommunityFlair[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    hasMore: false,
    nextCursor: '',
  });
  const [editPanel, setEditPanel] = useState<FlairEditPanel>({
    show: true,
    mode: 'create',
    flair: {
      ...DEFAULT_FLAIR,
      community_id: community.id,
    },
    count: 0,
  });

  const loadMore = useCallback(
    (cursorId: string, isInitialFetch = false) => {
      if (!token) return;

      setLoading(true);
      void fetchCommunityFlairs(
        token,
        {
          community_name: community.name,
          cursor_id: cursorId,
          getFlairCount: isInitialFetch,
          type: flairType,
        },
        (newFlairs, newPagination, flairCount) => {
          cursorId === ''
            ? setFlairs(newFlairs) // Initial call
            : setFlairs((prev) => [...prev, ...newFlairs]); // Loading more - append to arr

          setPagination(newPagination);
          if (isInitialFetch) {
            setEditPanel((prev) => ({ ...prev, count: flairCount ? flairCount : 0 }));
          }
          setLoading(false);
        },
      );
    },
    [community.name, token, flairType],
  );

  useEffect(() => {
    loadMore('', true);
  }, [loadMore]);

  return (
    <div className="p-4 h-full-header center-main">
      <div
        className={`grid w-full max-w-[900px] ${editPanel.show ? 'grid-cols-2' : 'grid-cols-1'}`}
      >
        <div>
          <div className="flex items-center justify-between">
            <div className="mb-4 flex items-center gap-3">
              <button
                className="rounded-full p-2 normal-bg-transition"
                onClick={() => navigate(`/r/${community.name}/mod/settings`)}
              >
                <ArrowLeftIcon strokeWidth={1.7} />
              </button>

              <div className="text-3xl font-bold">
                {flairType === 'post' ? 'Post Flair' : 'User Flair'}
              </div>
            </div>

            <button
              className="min-h-10 !font-medium prm-button-blue"
              onClick={() =>
                setEditPanel((prev) => ({
                  count: prev.count,
                  show: prev.mode === 'edit' ? true : !prev.show,
                  mode: 'create',
                  flair: {
                    ...DEFAULT_FLAIR,
                    community_id: community.id,
                  },
                }))
              }
            >
              New Flair
            </button>
          </div>

          <div className="text-sm">
            Allow users to add an remove flair from their posts.
          </div>

          <FlairOverview
            flairType={flairType}
            editPanel={editPanel}
            setEditPanel={setEditPanel}
            token={token}
            communityId={community.id}
            flairs={flairs}
            pagination={pagination}
            submitting={submitting}
            setSubmitting={setSubmitting}
            loading={loading}
            loadMore={loadMore}
            setFlairs={(flairId) => {
              setFlairs((prev) => prev.filter((flair) => flair.id !== flairId));
              setEditPanel((prev) => ({ ...prev, count: prev.count - 1 }));
            }}
          />
        </div>

        <div className="h-full">
          <EditFlairPanel
            flairType={flairType}
            setFlairs={setFlairs}
            token={token}
            submitting={submitting}
            setSubmitting={setSubmitting}
            editPanel={editPanel}
            setEditPanel={setEditPanel}
            DEFAULT_FLAIR={DEFAULT_FLAIR}
          />
        </div>
      </div>
    </div>
  );
}
