import { useState } from 'react';

import PostEditor from '@/Main/Post/components/PostEditor/PostEditor';
import HideContent from '@/Main/Post/components/tags/common/HideContent';
import { LockIcon, TrashIcon, BanIcon } from 'lucide-react';
import { Transition } from '@headlessui/react';

import transitionPropsHeight from '@/util/transitionProps';
import { DBPostWithCommunity } from '@/interface/dbSchema';

interface PostContentProps {
  post: DBPostWithCommunity;
  isEditActive: boolean;
  setIsEditActive: React.Dispatch<React.SetStateAction<boolean>>;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  token: string | null;
}

export default function PostContent({
  post,
  isEditActive,
  setIsEditActive,
  setPost,
  token,
}: PostContentProps) {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [showMature, setShowMature] = useState(false);

  const isMature = post.is_mature;
  const isSpoiler = post.is_spoiler;
  const isRemovedByMod = post.moderation?.action === 'REMOVED';

  const showBody = showMature || showSpoiler || !(isMature || isSpoiler);
  const hideContent = !showMature && !showSpoiler && (isMature || isSpoiler);

  const toggleShow = () => {
    setIsEditActive((prev) => !prev);
  };

  return (
    <div className="py-4 pt-2">
      <Transition show={!isEditActive} {...transitionPropsHeight}>
        <div>
          {post.deleted_at ? (
            <div className="post-message my-4">
              <TrashIcon className="flex-shrink-0 text-red-500" />

              <span className="break-words">
                Sorry, this post was deleted by the person who originally posted it.
              </span>
            </div>
          ) : (
            !isRemovedByMod && (
              <div>
                <Transition show={showBody} {...transitionPropsHeight}>
                  <div className="break-all">{post.body}</div>
                </Transition>

                <Transition show={hideContent} {...transitionPropsHeight}>
                  <div>
                    <HideContent
                      isMature={isMature}
                      isSpoiler={isSpoiler}
                      setShowMature={setShowMature}
                      setShowSpoiler={setShowSpoiler}
                    />
                  </div>
                </Transition>
              </div>
            )
          )}

          {isRemovedByMod && (
            <div className="post-message my-4">
              <BanIcon className="flex-shrink-0 text-red-500" />

              <span className="break-works">
                Sorry, this post has been removed by the moderators.
              </span>
            </div>
          )}

          {post.lock_comments && (
            <div className="post-message my-4">
              <LockIcon className="flex-shrink-0" />

              <span className="break-works">
                Locked post. New comments cannot be posted.
              </span>
            </div>
          )}
        </div>
      </Transition>

      <Transition show={isEditActive} {...transitionPropsHeight}>
        <div>
          <PostEditor
            post={post}
            setPost={setPost}
            toggleShow={toggleShow}
            setIsEditActive={setIsEditActive}
            token={token}
          />
        </div>
      </Transition>
    </div>
  );
}
