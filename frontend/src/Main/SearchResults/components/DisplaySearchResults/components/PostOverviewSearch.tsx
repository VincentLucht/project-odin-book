import Separator from '@/components/Separator';
import PFP from '@/components/PFP';
import SpoilerTag from '@/Main/Post/components/tags/common/SpoilerTag';
import MatureTag from '@/Main/Post/components/tags/common/MatureTag';
import { Link } from 'react-router-dom';

import getRelativeTime from '@/util/getRelativeTime';
import slugify from 'slugify';
import formatCount from '@/components/sidebar/DisplayMemberCount.tsx/formatCount';

interface PostOverviewSearchProps {
  post: {
    id: string;
    name: string;
    total_votes: number;
    total_comments: number;
    created_at: Date | string;
    is_spoiler: boolean;
    is_mature: boolean;
    image_url: string | null;
  };
  community: {
    name: string;
    profile_picture_url?: string | null;
    is_mature: boolean;
  };
}

export default function PostOverviewSearch({
  post,
  community,
}: PostOverviewSearchProps) {
  if (!post || !community) return null;

  const isMature = post.is_mature || community.is_mature;
  const isSpoiler = post.is_spoiler;

  return (
    <div>
      <Separator className="my-[3px]" />

      <Link
        className="flex cursor-pointer flex-col gap-2 break-all rounded-2xl px-4 py-6 text-sm
          bg-transition-hover"
        to={`/r/${encodeURIComponent(community.name)}/${post.id}/${slugify(post.name, { lower: true })}`}
      >
        <div className="flex items-center gap-1">
          <PFP src={community.profile_picture_url} />

          <div className="font-semibold">r/{community.name}</div>

          <div className="gap-1 text-xs df text-gray-secondary">
            • {getRelativeTime(post.created_at as Date)}
          </div>
        </div>

        <div className="-mt-2 flex items-center gap-1">
          {isSpoiler && <SpoilerTag />}
          {isMature && <MatureTag />}
        </div>

        <div className="text-lg font-semibold">{post.name}</div>

        <div className="text-xs text-gray-secondary">
          <span>
            {formatCount(post.total_votes)} {post.total_votes === 1 ? 'Vote' : 'Votes'}
          </span>

          <span className="mx-[6px]">•</span>

          <span>
            {formatCount(post.total_comments)}{' '}
            {post.total_comments === 1 ? 'Comment' : 'Comments'}
          </span>
        </div>
      </Link>
    </div>
  );
}
