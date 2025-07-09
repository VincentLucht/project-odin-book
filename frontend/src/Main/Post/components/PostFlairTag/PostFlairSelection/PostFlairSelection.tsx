import { useState, useEffect, useCallback } from 'react';

import { Modal } from '@/components/Modal/Modal';
import VirtualizedPostFlairSelection from '@/Main/Post/components/PostFlairTag/PostFlairSelection/components/VirtualizedPostFlairSelection';
import InputWithImg from '@/components/InputWithImg';

import { fetchCommunityFlairs } from '@/Main/Community/components/ModTools/components/CommunitySettings/api/communityFlairAPI';
import handleAssignPostFlair from '@/Main/Post/components/PostFlairTag/PostFlairSelection/api/handleAssignPostFlair';
import handleDeletePostFlair from '@/Main/Post/components/PostFlairTag/PostFlairSelection/api/handleDeletePostFlair';

import { DBCommunityFlair } from '@/interface/dbSchema';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import { Pagination } from '@/interface/backendTypes';

interface PostFlairSelectionProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  communityName?: string;
  postId?: string;
  activePostFlairId: string;
  setPost?: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  token: string | null;
  cb?: (flair: DBCommunityFlair) => void;
}

export default function PostFlairSelection({
  show,
  setShow,
  communityName,
  postId,
  activePostFlairId,
  setPost,
  token,
  cb,
}: PostFlairSelectionProps) {
  const [availableFlairs, setAvailableFlairs] = useState<DBCommunityFlair[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    hasMore: true,
    nextCursor: '',
  });
  const [query, setQuery] = useState('');

  const loadMore = useCallback(
    (cursorId: string, isInitialFetch = false) => {
      if (!communityName || !show || !token) return;
      setLoading(true);

      void fetchCommunityFlairs(
        token,
        {
          community_name: communityName,
          type: 'post',
          cursor_id: cursorId,
        },
        (postFlairs, pagination) => {
          isInitialFetch
            ? setAvailableFlairs(postFlairs)
            : setAvailableFlairs((prev) => [...prev, ...postFlairs]);
          setPagination(pagination);
          setLoading(false);
        },
      );
    },
    [token, communityName, show],
  );

  useEffect(() => {
    loadMore('', true);
  }, [loadMore]);

  const onSelect = (flair: DBCommunityFlair) => {
    if (postId && setPost) {
      handleAssignPostFlair(postId, flair.id, setPost, token);
    }

    if (cb) {
      cb(flair);
    }
  };

  const onDelete = () => {
    if (postId && setPost && activePostFlairId) {
      handleDeletePostFlair(postId, activePostFlairId, setPost, token);
    }
  };

  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <h2 className="text-xl font-semibold">Select a Post Flair from the community</h2>

      <InputWithImg
        value={query}
        setterFunc={setQuery}
        src="/magnify.svg"
        alt="Magnifying glass icon"
        placeholder="Search Post Flair"
        imgClassName=""
      />

      <VirtualizedPostFlairSelection
        flairs={availableFlairs}
        loading={loading}
        loadMore={loadMore}
        pagination={pagination}
        activePostFlairId={activePostFlairId}
        onSelect={onSelect}
        onDelete={onDelete}
        searchTerm={query}
      />

      <button className="h-7 prm-button-red" onClick={() => setShow(false)}>
        Close
      </button>
    </Modal>
  );
}
