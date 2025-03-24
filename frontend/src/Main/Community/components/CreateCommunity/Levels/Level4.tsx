import ButtonWithImgAndCircle from '@/components/Interaction/ButtonWithImgAndCircle';
import Separator from '@/components/Separator';

import {
  GlobeIcon,
  EyeIcon,
  LockIcon,
  CircleAlertIcon,
  TagIcon,
  PenOffIcon,
} from 'lucide-react';

import { CommunityTypes } from '@/interface/dbSchema';

interface Level4Props {
  level: number;
  selectedType: CommunityTypes;
  setSelectedType: React.Dispatch<React.SetStateAction<CommunityTypes>>;
  isMature: boolean;
  setIsMature: React.Dispatch<React.SetStateAction<boolean>>;
  isPostFlairRequired: boolean;
  setIsPostFlairRequired: React.Dispatch<React.SetStateAction<boolean>>;
  allowBasicUserPosts: boolean;
  setAllowBasicUserPosts: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Allows to choose the community type, and other options like if it is mature or requiring a post to have post flair.
 */
export default function Level4({
  level,
  selectedType,
  setSelectedType,
  isMature,
  setIsMature,
  isPostFlairRequired,
  setIsPostFlairRequired,
  allowBasicUserPosts,
  setAllowBasicUserPosts,
}: Level4Props) {
  if (level !== 4) {
    return;
  }

  const onSelect = (type: CommunityTypes) => {
    if (type === selectedType) {
      return;
    }

    setSelectedType(type);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">What type of community is this?</h2>

      <div className="mb-4 mt-2 text-sm text-gray-secondary">
        Decide who can view and contribute in your community.
        <span className="font-bold"> Important:</span> Once set, you are not able to
        change the type of your community.
      </div>

      <div className="flex flex-col gap-2">
        <ButtonWithImgAndCircle
          icon={<GlobeIcon />}
          header="Public"
          subText="Anyone can view, post, and comment in this community"
          isSelected={selectedType === 'PUBLIC'}
          className=""
          onClick={() => onSelect('PUBLIC')}
        />

        <ButtonWithImgAndCircle
          icon={<EyeIcon />}
          header="Restricted"
          subText="Anyone can view, but only approved users can contribute"
          isSelected={selectedType === 'RESTRICTED'}
          className=""
          onClick={() => onSelect('RESTRICTED')}
        />

        <ButtonWithImgAndCircle
          icon={<LockIcon className="flex-shrink-0" />}
          header="Private"
          subText="Only approved users can view and contribute, Note: Private communities still show up in search, but are not accessible to non-members"
          isSelected={selectedType === 'PRIVATE'}
          className=""
          onClick={() => onSelect('PRIVATE')}
        />

        <div className="my-2">
          <Separator />
        </div>

        <ButtonWithImgAndCircle
          icon={<CircleAlertIcon />}
          header="Mature (18+)"
          subText="Users must be over 18 to view and contribute"
          isSelected={isMature}
          onClick={() => setIsMature((m) => !m)}
        />

        <ButtonWithImgAndCircle
          icon={<TagIcon />}
          header="Require post flair"
          subText="Users must add a post flair to every post"
          isSelected={isPostFlairRequired}
          onClick={() => setIsPostFlairRequired((req) => !req)}
        />

        {selectedType === 'PRIVATE' || selectedType === 'RESTRICTED' ? (
          <ButtonWithImgAndCircle
            icon={<PenOffIcon />}
            header="Allow basic users to post"
            subText="Only allow users with the role of contributor to post"
            isSelected={allowBasicUserPosts}
            onClick={() => setAllowBasicUserPosts((req) => !req)}
          />
        ) : null}
      </div>
    </div>
  );
}
