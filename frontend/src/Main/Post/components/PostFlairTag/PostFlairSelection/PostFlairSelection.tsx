import { useState, useEffect, useMemo } from 'react';

import { Modal } from '@/components/Modal/Modal';
import SelectFlair from '@/Main/Post/components/PostFlairTag/PostFlairSelection/components/SelectFlair';
import InputWithImg from '@/components/InputWithImg';

import fetchPostFlair from '@/Main/Post/components/PostFlairTag/api/fetchPostFlair';
import catchError from '@/util/catchError';
import handleAssignPostFlair from '@/Main/Post/components/PostFlairTag/PostFlairSelection/api/handleAssignPostFlair';

import { DBCommunityFlair } from '@/interface/dbSchema';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import handleDeletePostFlair from '@/Main/Post/components/PostFlairTag/PostFlairSelection/api/handleDeletePostFlair';

interface PostFlairSelectionProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  communityId?: string;
  postId?: string;
  activePostFlairId: string;
  setPost?: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  token: string | null;
  cb?: (flair: DBCommunityFlair) => void;
}

export default function PostFlairSelection({
  show,
  setShow,
  communityId,
  postId,
  activePostFlairId,
  setPost,
  token,
  cb,
}: PostFlairSelectionProps) {
  const [availableFlairs, setAvailableFlairs] = useState<DBCommunityFlair[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useState('');
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return availableFlairs;
    }

    return availableFlairs.filter((flair) => {
      if (flair.name.toLowerCase().includes(query.toLowerCase())) {
        return true;
      }

      if (flair?.emoji?.includes(query)) {
        return true;
      }

      return false;
    });
  }, [query, availableFlairs]);

  useEffect(() => {
    if (show && token && communityId) {
      fetchPostFlair(communityId, token)
        .then((response) => {
          setAvailableFlairs(response.allPostFlairs);
          setIsLoading(false);
        })
        .catch((error) => {
          catchError(error);
          setIsLoading(false);
        });
    }
  }, [show, token, communityId]);

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

  const removeFlair = {
    id: 'inactive',
    community_id: '',
    textColor: '',
    name: 'No post flair',
    color: '',
    emoji: '',
    is_assignable_to_posts: true,
    is_assignable_to_users: true,
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

      {isLoading ? (
        <div className="df">
          <div className="spinner-dots"></div>
        </div>
      ) : (
        <div className="flex-1 flex-col gap-1 overflow-y-auto df">
          {!filteredItems.length ? (
            <div>There are no Post Flairs in this community...</div>
          ) : (
            <>
              <SelectFlair
                flair={removeFlair}
                onClick={() => onDelete()}
                isCurrentlyActive={!activePostFlairId}
              />

              {filteredItems.map((flair) => (
                <SelectFlair
                  flair={flair}
                  key={flair.id}
                  onClick={() => onSelect(flair)}
                  isCurrentlyActive={flair.id === activePostFlairId}
                />
              ))}
            </>
          )}
        </div>
      )}

      <button className="h-7 prm-button-red" onClick={() => setShow(false)}>
        Close
      </button>
    </Modal>
  );
}
