import Separator from '@/components/Separator';
import PFP from '@/components/PFP';
import MatureTag from '@/Main/Post/components/tags/common/MatureTag';
import SpoilerTag from '@/Main/Post/components/tags/common/SpoilerTag';

import getCommentThreadUrl from '@/util/getCommentThreadUrl';
import getRelativeTime from '@/util/getRelativeTime';
import formatCount from '@/components/sidebar/DisplayMemberCount.tsx/formatCount';

import { CommunityTypes, DBComment } from '@/interface/dbSchema';
import { NavigateFunction } from 'react-router-dom';

export interface DBCommentSearch extends DBComment {
  post: {
    community: {
      name: string;
      profile_picture_url: string | null;
      type: CommunityTypes;
    };
    id: string;
    title: string;
    created_at: Date | string;
    total_comment_score: number;
    total_vote_score: number;
    is_mature: boolean;
    is_spoiler: boolean;
  };
  user: {
    username: string;
    profile_picture_url: string | null;
  };
}

interface CommentOverviewSearchProps {
  comment: DBCommentSearch;
  navigate: NavigateFunction;
}

export default function CommentOverviewSearch({
  comment,
  navigate,
}: CommentOverviewSearchProps) {
  const postRedirect = () => {
    navigate(`/r/${comment.post.community.name}/${comment.post.id}/`);
  };

  const commentRedirect = (e: React.MouseEvent) => {
    e.stopPropagation();

    const urlToComment = getCommentThreadUrl(
      {
        communityName: comment.post.community.name,
        postId: comment.post_id,
        postName: comment.post.title,
      },
      comment.id,
      'relativeUrl',
    );

    navigate(urlToComment);
  };

  return (
    <div>
      <Separator className="my-2" />

      <div
        className="flex cursor-pointer flex-col gap-2 rounded-2xl p-4 text-sm bg-transition-hover"
        onClick={postRedirect}
      >
        <div className="flex items-center gap-1">
          <PFP src={comment.post.community.profile_picture_url} />

          <div className="font-semibold">r{comment.post.community.name}</div>

          <div className="gap-1 text-xs df text-gray-secondary">
            • {getRelativeTime(comment.post.created_at as Date)}
          </div>
        </div>

        <div className="-mt-2 flex items-center gap-1">
          {comment.post.is_spoiler && <SpoilerTag />}
          {comment.post.is_mature && <MatureTag />}
        </div>

        <div className="text-[17px] font-medium leading-7">{comment.post.title}</div>

        <div className="rounded-xl bg-neutral-950 p-4" onClick={commentRedirect}>
          <div className="flex items-center">
            <PFP src={comment.user.profile_picture_url} />

            <div className="ml-[6px] mr-1">{comment.user.username}</div>

            <div className="gap-1 text-xs df text-gray-secondary">
              • {getRelativeTime(comment.post.created_at as Date)}
            </div>
          </div>

          <div className="mt-3 line-clamp-[9] max-h-[300px] overflow-hidden">
            {comment.content}
          </div>

          <div className="mt-3 text-xs text-gray-secondary">
            {formatCount(comment.total_vote_score)}{' '}
            {comment.total_vote_score === 1 ? 'vote' : 'votes'}
          </div>
        </div>

        <div className="text-xs text-gray-secondary">
          <button
            className="mb-[2px] w-fit font-medium text-blue-400 hover:underline"
            onClick={commentRedirect}
          >
            Go To Thread
          </button>

          <div>
            <span>
              {formatCount(comment.post.total_vote_score)}{' '}
              {comment.post.total_vote_score === 1 ? 'vote' : 'votes'}
            </span>

            <span className="mx-2">•</span>

            <span>
              {formatCount(comment.post.total_comment_score)}{' '}
              {comment.post.total_comment_score === 1 ? 'comment' : 'comments'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
