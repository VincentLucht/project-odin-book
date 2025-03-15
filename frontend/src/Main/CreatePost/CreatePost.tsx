import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';

import MemberCheck from '@/Main/CreatePost/components/MemberCheck';
import SetPostType from '@/Main/CreatePost/components/SetPostType';
import SelectCommunity from '@/Main/CreatePost/components/SelectCommunity/SelectCommunity';
import InputWithImg from '@/components/InputWithImg';
import { CaptionsIcon } from 'lucide-react';
import SpoilerTag from '@/Main/Post/components/tags/common/SpoilerTag';
import MatureTag from '@/Main/Post/components/tags/common/MatureTag';
import PostFlairSelection from '@/Main/Post/components/PostFlairTag/PostFlairSelection/PostFlairSelection';
import PostFlairTag from '@/Main/Post/components/PostFlairTag/PostFlairTag';
import { CircleAlertIcon } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import MaxLengthIndicator from '@/components/MaxLengthIndicator';
import CloseButton from '@/components/Interaction/CloseButton';

import CreatePostSidebar from '@/Main/CreatePost/components/CreatePostSidebar/CreatePostSidebar';

import handleCreatePost from '@/Main/Post/api/create/handleCreatePost';

import { CreationInfo } from '@/Main/CreatePost/components/SelectCommunity/api/getCreationInfo';
import { DBCommunityFlair } from '@/interface/dbSchema';

export type PostType = 'BASIC' | 'images' | 'POLL';

// TODO: Add max len indicator for body?
export default function CreatePost() {
  const [postType, setPostType] = useState<PostType>('BASIC');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isMature, setIsMature] = useState(false);

  const [showPostFlairSelection, setShowPostFlairSelection] = useState(false);
  const [activePostFlair, setActivePostFlair] = useState<DBCommunityFlair | null>(null);

  const [activeCommunity, setActiveCommunity] = useState<CreationInfo | null>(null);
  const [isAllowedToPost, setIsAllowedToPost] = useState(true);

  const [searchParams] = useSearchParams();
  const communityName = searchParams.get('community');

  const { user, token } = useAuthGuard();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const isPostFlairRequired =
    activeCommunity?.is_post_flair_required && !activePostFlair;

  const onPostTypeChange = (postType: PostType) => {
    setPostType(postType);
  };

  const onCreate = () => {
    if (!activeCommunity || isPostFlairRequired) {
      return;
    }

    handleCreatePost(
      activeCommunity.id,
      title,
      body,
      isSpoiler,
      isMature,
      postType,
      token,
      activePostFlair?.id ?? '',
      navigate,
    );
  };

  useEffect(() => {
    setActivePostFlair(null);
  }, [activeCommunity]);

  return (
    <div className="overflow-y-scroll p-4 center-main">
      <div className="center-main-content">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Create post</h2>

          <SelectCommunity
            communityName={communityName}
            token={token}
            activeCommunity={activeCommunity}
            setActiveCommunity={setActiveCommunity}
            setIsLoading={setIsLoading}
          />

          <MemberCheck
            community={activeCommunity}
            user={user}
            isAllowedToPost={isAllowedToPost}
            setIsAllowedToPost={setIsAllowedToPost}
          />

          <SetPostType postType={postType} onPostTypeChange={onPostTypeChange} />

          <div className={`flex ${isSpoiler || isMature ? 'h-7' : ''} gap-1`}>
            {isSpoiler && <SpoilerTag />}
            {isMature && <MatureTag />}
          </div>

          <InputWithImg
            value={title}
            setterFunc={setTitle}
            src=""
            alt=""
            placeholder="Title*"
            className="mt-2 !h-12 !rounded-2xl"
            icon={<CaptionsIcon className="mr-1" />}
            maxLength={300}
          />
          <MaxLengthIndicator length={title.length} maxLength={300} />
          {activePostFlair && (
            <div className="mb-4 flex items-center gap-1">
              <div>
                <PostFlairTag
                  showFlair={true}
                  postAssignedFlair={[
                    { id: 'tempID', community_flair: activePostFlair },
                  ]}
                />
              </div>

              <CloseButton
                customFunc={() => setActivePostFlair(null)}
                outline={false}
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (activeCommunity) {
                  setShowPostFlairSelection(true);
                }
              }}
              className={`h-8 text-sm ${!activePostFlair ? 'prm-button-blue' : 'prm-button-red'}`}
            >
              {activePostFlair ? 'Edit Post Flair' : 'Add Post Flair'}
            </button>

            <button
              onClick={() => setIsSpoiler((prev) => !prev)}
              className={`h-8 text-sm ${!isSpoiler ? 'prm-button-blue' : 'prm-button-red'}`}
            >
              {!isSpoiler ? 'Add Spoiler tag' : 'Remove Spoiler tag'}
            </button>

            <button
              onClick={() => setIsMature((prev) => !prev)}
              className={`h-8 text-sm ${!isMature ? 'prm-button-blue' : 'prm-button-red'}`}
            >
              {!isMature ? 'Add NSFW tag' : 'Remove NSFW tag'}
            </button>
          </div>

          <div className="mt-4 flex flex-col">
            <TextareaAutosize
              className="w-full rounded-2xl px-4 py-4 focus-blue"
              placeholder="Body"
              minRows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              {activeCommunity?.is_post_flair_required && !activePostFlair && (
                <div className="gap-1 text-sm df text-gray-secondary">
                  <CircleAlertIcon className="h-5 w-5 text-red-500" />
                  Your post must contain post flair
                </div>
              )}

              <button
                className={`h-8 prm-button-blue
                  ${!activeCommunity || !title || !body || !isAllowedToPost || isPostFlairRequired ? '!bg-gray-700' : ''}`}
                onClick={() => {
                  if (activeCommunity && title && body && isAllowedToPost) {
                    onCreate();
                  }
                }}
              >
                Post
              </button>
            </div>
          </div>

          <PostFlairSelection
            show={showPostFlairSelection}
            setShow={setShowPostFlairSelection}
            communityId={activeCommunity?.id}
            activePostFlairId={activePostFlair?.id ? activePostFlair.id : ''}
            token={token}
            cb={(flair) => {
              setActivePostFlair(flair);
              setShowPostFlairSelection(false);
            }}
          />
        </div>

        <CreatePostSidebar
          communityName={activeCommunity?.name}
          rules={activeCommunity?.community_rules}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
