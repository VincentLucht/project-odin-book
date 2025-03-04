import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';

import LevelIndicator from '@/Main/Community/components/CreateCommunity/Levels/LevelIndicator';
import Level1 from '@/Main/Community/components/CreateCommunity/Levels/Level1';
import Level2 from '@/Main/Community/components/CreateCommunity/Levels/Level2/Level2';
import Level3 from '@/Main/Community/components/CreateCommunity/Levels/Level3/Level3';
import Level4 from '@/Main/Community/components/CreateCommunity/Levels/Level4';

import handleCreateCommunity from '@/Main/Community/components/CreateCommunity/api/handleCreateCommunity';

import { DBTopic } from '@/interface/dbSchema';
import { CommunityTypes } from '@/interface/dbSchema';

export interface IsValid {
  [key: number]: boolean;
}

export default function CreateCommunity() {
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');

  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [bannerUrlMobile, setBannerUrlMobile] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  const [activeTopics, setActiveTopics] = useState<DBTopic[]>([]);

  const [selectedType, setSelectedType] = useState<CommunityTypes>('PUBLIC');
  const [isMature, setIsMature] = useState(false);
  const [isPostFlairRequired, setIsPostFlairRequired] = useState(false);
  const [allowBasicUserPosts, setAllowBasicUserPosts] = useState(true);

  const [level, setLevel] = useState(1);
  const [isValid, setIsValid] = useState<IsValid>({
    1: false,
    2: true,
    3: false,
    4: true,
  });
  const navigate = useNavigate();
  const { token } = useAuthGuard();

  const increaseLevel = (level: number) => {
    if (isValid[level] && level < 4) {
      setLevel((l) => l + 1);
    }
  };

  const decreaseLevel = () => {
    if (level !== 1) {
      setLevel((l) => l - 1);
    }
  };

  const onCreate = () => {
    void handleCreateCommunity(
      communityName,
      description,
      isMature,
      allowBasicUserPosts,
      isPostFlairRequired,
      selectedType,
      activeTopics,
      bannerUrl,
      bannerUrlMobile,
      iconUrl,
      token,
      navigate,
    );
  };

  return (
    <div className="overflow-y-scroll p-4 center-main">
      <div
        className={`h-fit center-main-content ${level === 2 && '!grid-cols-1'}
          ${level === 3 || level === 4 ? '!h-[calc(100dvh-88px)] !grid-cols-1 !grid-rows-[1fr_auto] !gap-0' : ''}`}
      >
        <Level1
          level={level}
          token={token}
          setIsValid={setIsValid}
          setLevel={setLevel}
          communityName={communityName}
          setCommunityName={setCommunityName}
          description={description}
          setDescription={setDescription}
        />

        <Level2
          level={level}
          communityName={communityName}
          bannerUrl={bannerUrl}
          setBannerUrl={setBannerUrl}
          bannerUrlMobile={bannerUrlMobile}
          setBannerUrlMobile={setBannerUrlMobile}
          iconUrl={iconUrl}
          setIconUrl={setIconUrl}
        />

        <Level3
          level={level}
          setIsValid={setIsValid}
          activeTopics={activeTopics}
          setActiveTopics={setActiveTopics}
        />

        <Level4
          level={level}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          isMature={isMature}
          setIsMature={setIsMature}
          isPostFlairRequired={isPostFlairRequired}
          setIsPostFlairRequired={setIsPostFlairRequired}
          allowBasicUserPosts={allowBasicUserPosts}
          setAllowBasicUserPosts={setAllowBasicUserPosts}
        />

        <div className="flex items-center justify-between">
          <LevelIndicator level={level} />

          <div
            className={`flex gap-2 ${level === 3 && '-mb-3 -mr-6 p-6'} ${level === 4 && '-mr-6 p-6'}`}
          >
            <button className="h-8 prm-button-red" onClick={decreaseLevel}>
              Cancel
            </button>

            <button
              className={`h-8 prm-button-blue ${!isValid[level] && '!bg-gray-700'}`}
              onClick={() => {
                increaseLevel(level);
                if (level === 4) {
                  onCreate();
                }
              }}
            >
              {level !== 4 ? 'Next' : 'Create Community'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
