import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';

import MemberCheck from '@/Main/CreatePost/components/MemberCheck';
import SetPostType from '@/Main/CreatePost/components/SetPostType';
import SelectCommunity from '@/Main/CreatePost/components/SelectCommunity/SelectCommunity';
import InputWithImg from '@/components/InputWithImg';
import { CaptionsIcon } from 'lucide-react';
import SpoilerTag from '@/Main/Post/components/tags/common/SpoilerTag';
import MatureTag from '@/Main/Post/components/tags/common/MatureTag';
import TextareaAutosize from 'react-textarea-autosize';

import handleCreatePost from '@/Main/Post/api/create/handleCreatePost';

import { CreationInfo } from '@/Main/CreatePost/components/SelectCommunity/api/getCreationInfo';

export type PostType = 'BASIC' | 'images' | 'POLL';

export default function CreatePost() {
  const [postType, setPostType] = useState<PostType>('BASIC');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isMature, setIsMature] = useState(false);

  const [activeCommunity, setActiveCommunity] = useState<CreationInfo | null>(null);
  const [isAllowedToPost, setIsAllowedToPost] = useState(true);

  const { communityName } = useParams();
  const { user, token } = useAuthGuard();
  const navigate = useNavigate();

  const onPostTypeChange = (postType: PostType) => {
    setPostType(postType);
  };

  const onCreate = () => {
    if (!activeCommunity) {
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
      navigate,
    );
  };

  return (
    <div className="p-4 center-main">
      <div className="center-main-content">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Create post</h2>

          <SelectCommunity
            communityName={communityName}
            token={token}
            activeCommunity={activeCommunity}
            setActiveCommunity={setActiveCommunity}
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
          <div className="flex justify-end">
            <span className="mr-4 mt-1 text-sm">{title.length}/300</span>
          </div>

          <div className="flex gap-2">
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
              className="w-full rounded-2xl px-4 py-4"
              placeholder="Body"
              minRows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />

            <div className="flex justify-end pt-2">
              <button
                className={`h-8 prm-button-blue
                  ${!activeCommunity || !title || !body || !isAllowedToPost ? '!bg-gray-700' : ''}`}
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
        </div>

        {/* TODO: Only show community rules if there are any */}
        <div>Sidebar</div>
      </div>
    </div>
  );
}
