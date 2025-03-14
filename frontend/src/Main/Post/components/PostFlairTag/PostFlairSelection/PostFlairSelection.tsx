import { useState, useEffect, useMemo } from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import { useTransition, animated } from '@react-spring/web';

import SelectFlair from '@/Main/Post/components/PostFlairTag/PostFlairSelection/components/SelectFlair';
import InputWithImg from '@/components/InputWithImg';

import fetchPostFlair from '@/Main/Post/components/PostFlairTag/api/fetchPostFlair';
import catchError from '@/util/catchError';
import handleAssignPostFlair from '@/Main/Post/components/PostFlairTag/PostFlairSelection/api/handleAssignPostFlair';

import { DBCommunityFlair } from '@/interface/dbSchema';
import { DBPostWithCommunity } from '@/interface/dbSchema';

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
  const dropdownRef = useClickOutside(() => {
    setShow(false);
  });

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

  const transition = useTransition(show, {
    from: { opacity: 0, scale: 0.9 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.9 },
    config: { tension: 280, friction: 20, clamp: true },
  });

  const backdropTransition = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 0.3 },
    leave: { opacity: 0 },
    config: { tension: 280, friction: 20 },
  });

  const onSelect = (flair: DBCommunityFlair) => {
    if (postId && setPost) {
      handleAssignPostFlair(postId, flair.id, setPost, token);
    }

    if (cb) {
      cb(flair);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {backdropTransition(
        (styles, item) =>
          item && (
            <animated.div
              style={styles}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setShow(false)}
            />
          ),
      )}

      {/* Modal */}
      {transition(
        (styles, item) =>
          item && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
              <animated.div
                style={styles}
                className="flex max-h-[500px] flex-col gap-4 rounded-lg px-3 py-2 bg-gray"
                ref={dropdownRef}
              >
                <h2 className="text-xl font-semibold">
                  Select a Post Flair from the community
                </h2>

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
                      filteredItems.map((flair) => (
                        <SelectFlair
                          flair={flair}
                          key={flair.id}
                          onClick={() => onSelect(flair)}
                          isCurrentlyActive={flair.id === activePostFlairId}
                        />
                      ))
                    )}
                  </div>
                )}

                <button className="h-7 prm-button-red" onClick={() => setShow(false)}>
                  Close
                </button>
              </animated.div>
            </div>
          ),
      )}
    </>
  );
}
