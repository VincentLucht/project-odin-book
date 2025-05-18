import Separator from '@/components/Separator';
import CommentInteractionBar from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/CommentInteractionBar';
import RemovalMessage from '@/components/Message/RemovalMessage';

import getRelativeTime from '@/util/getRelativeTime';
import handleCommentVoteOverview from '@/Main/CommentOverview/api/handleCommentVoteOverview';
import handleDeleteCommentOverview from '@/Main/CommentOverview/api/handleDeleteCommentOverview';
import getCommentThreadUrl from '@/util/getCommentThreadUrl';
import confirmDelete from '@/util/confirmDelete';

import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { DBCommentWithCommunityName } from '@/interface/dbSchema';
import { VoteType } from '@/interface/backendTypes';
import { UrlItems } from '@/components/Interaction/Share';
import { NavigateFunction } from 'react-router-dom';
import { LockIcon } from 'lucide-react';

interface CommentOverviewProps {
  comment: DBCommentWithCommunityName;
  urlItems?: UrlItems;
  userId: string | undefined;
  token: string | null;
  showPrivate?: boolean; // display a lock icon next to a comment from a private community
  showRemovedByModeration?: boolean;
  showCommentDropdown: string | null;
  setShowCommentDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  setUserHistory: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>;
  navigate: NavigateFunction;
}

// TODO: Add replied to if it is a reply??
export default function CommentOverview({
  comment,
  urlItems,
  userId,
  token,
  showPrivate,
  showRemovedByModeration,
  showCommentDropdown,
  setShowCommentDropdown,
  setUserHistory,
  navigate,
}: CommentOverviewProps) {
  const redirectToComment = (isReply: boolean, e?: React.MouseEvent) => {
    // Only redirect when clicking outside a button
    if (e && (e.target as HTMLElement).closest('button')) {
      return;
    }
    if (urlItems) {
      const urlToComment = getCommentThreadUrl(urlItems, comment.id, 'relativeUrl');
      navigate(`${urlToComment}${isReply ? `?reply=${comment.id}` : ''}`);
    }
  };

  const onVote = (
    commentId: string,
    voteType: VoteType,
    previousVoteType: VoteType | undefined,
  ) => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    void handleCommentVoteOverview(
      commentId,
      userId,
      voteType,
      previousVoteType,
      token,
      setUserHistory,
    );
  };

  const onEdit = () => {
    if (urlItems) {
      const urlToEdit = getCommentThreadUrl(urlItems, comment.id, 'relativeUrl');
      navigate(`${urlToEdit}?edit=${comment.id}`);
    }
  };

  const onDelete = (commentId: string) => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    if (confirmDelete('comment')) {
      handleDeleteCommentOverview(token, commentId, setUserHistory);
    }
  };

  return (
    <div>
      <Separator />

      <div
        className="m-1 flex gap-1 rounded-2xl p-3 transition-all hover:cursor-pointer
          hover:bg-hover-gray-secondary"
        onClick={(e) => redirectToComment(false, e)}
      >
        <img
          src={
            comment.post.community.profile_picture_url
              ? comment.post.community.profile_picture_url
              : '/community-default.svg'
          }
          alt="Community Profile Picture"
          className="h-6 w-6 rounded-full border"
        />

        <div>
          <div className="flex gap-[4px] text-sm">
            <span className="font-semibold">r/{comment.post.community.name}</span>

            {showPrivate && comment.post.community?.type === 'PRIVATE' && (
              <LockIcon className="h-4 w-4" />
            )}

            <span className="break-all">• {comment.post.title}</span>
          </div>

          <div className="flex gap-1 py-[6px]">
            <div className="text-sm font-semibold">{comment.user.username}</div>

            <div className="mb-[1px] self-end text-xs text-gray-secondary">
              commented {getRelativeTime(comment.created_at, true)}
            </div>
          </div>

          {showRemovedByModeration ? (
            <RemovalMessage show={true} type="comment" className="!my-1" />
          ) : (
            <div className="py-[6px]">{comment.content}</div>
          )}

          <div className="-ml-[5px]">
            <CommentInteractionBar
              totalVoteCount={comment.total_vote_score}
              userVote={{
                hasVoted: comment?.comment_votes?.[0]?.user_id === userId,
                voteType: comment?.comment_votes?.[0]?.vote_type,
              }}
              commentId={comment.id}
              isDeleted={comment.is_deleted}
              onVoteComment={onVote}
              onDeleteComment={onDelete}
              toggleShow={() => redirectToComment(true)}
              isUserSelf={comment.user_id === userId}
              showDropdown={showCommentDropdown}
              setShowDropdown={setShowCommentDropdown}
              isEditActive={false}
              urlItems={urlItems}
              onEdit={onEdit}
              isLocked={false}
              isMod={false}
              token={token}
              moderation={null}
              showModDropdown={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
