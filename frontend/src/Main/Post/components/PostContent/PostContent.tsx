import { useState } from 'react';

import { Transition } from '@headlessui/react';
import PostEditor from '@/Main/Post/components/PostEditor/PostEditor';
import HideContent from '@/Main/Post/components/tags/common/HideContent';

import transitionPropsHeight from '@/util/transitionProps';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import { TrashIcon } from 'lucide-react';

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
            <div className="flex items-center gap-2 rounded-md border border-gray-600 p-4 text-sm text-gray-400">
              <TrashIcon className="flex-shrink-0 text-red-500" />
              <span className="break-words">
                Sorry, this post was deleted by the person who originally posted it
              </span>
            </div>
          ) : (
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
