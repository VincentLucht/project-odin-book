import { useState } from 'react';

import Separator from '@/components/Separator';
import CommentInteractionBar from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/CommentInteractionBar';
import RemovalMessage from '@/components/Message/RemovalMessage';
import DeletedByPoster from '@/components/DeletedByPoster';
import PFP from '@/components/PFP';
import { Link } from 'react-router-dom';

import getRelativeTime from '@/util/getRelativeTime';
import handleCommentVoteOverview from '@/Main/CommentOverview/api/handleCommentVoteOverview';
import handleDeleteCommentOverview from '@/Main/CommentOverview/api/handleDeleteCommentOverview';
import getCommentThreadUrl from '@/util/getCommentThreadUrl';
import confirmDelete from '@/util/confirmDelete';
import { manageSavedComments } from '@/Main/Saved/api/savedApi';

import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';
import {
  DBCommentWithCommunityName,
  SavedComment,
  DBCommentWithReplies,
} from '@/interface/dbSchema';
import { VoteType } from '@/interface/backendTypes';
import { UrlItems } from '@/components/Interaction/Share';
import { NavigateFunction } from 'react-router-dom';
import { LockIcon } from 'lucide-react';
import notLoggedInError from '@/util/notLoggedInError';

interface CommentOverviewProps {
  comment: DBCommentWithCommunityName;
  urlItems?: UrlItems;
  userId: string | undefined;
  token: string | null;
  showPrivate?: boolean; // display a lock icon next to a comment from a private community
  showRemovedByModeration?: boolean;
  isLast: boolean;
  showCommentDropdown: string | null;
  setShowCommentDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  navigate: NavigateFunction;

  setUserHistory?: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>;
  setSavedComments?: React.Dispatch<React.SetStateAction<SavedComment[]>>;
}

// TODO: Add replied to if it is a reply??
export default function CommentOverview({
  comment,
  urlItems,
  userId,
  token,
  showPrivate,
  showRemovedByModeration,
  isLast,
  showCommentDropdown,
  setShowCommentDropdown,
  setUserHistory,
  setSavedComments,
  navigate,
}: CommentOverviewProps) {
  const [isHovered, setIsHovered] = useState(false);

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
      notLoggedInError('You need to log in to vote');
      return;
    }

    void handleCommentVoteOverview(
      commentId,
      userId,
      voteType,
      previousVoteType,
      token,
      setUserHistory,
      setSavedComments,
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
      handleDeleteCommentOverview(token, commentId, setUserHistory, setSavedComments);
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
        <Link
          to={`/r/${comment.post.community.name}`}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="h-fit"
        >
          <PFP src={comment.post.community.profile_picture_url} mode="community" />
        </Link>

        <div>
          <div className="flex gap-[4px] text-sm">
            <Link
              className={`hover:underline focus:underline ${isHovered ? 'underline' : ''}`}
              to={`/r/${comment.post.community.name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-semibold">r/{comment.post.community.name}</span>
            </Link>

            {showPrivate && comment.post.community?.type === 'PRIVATE' && (
              <LockIcon className="h-4 w-4" />
            )}

            <span className="break-all">• {comment.post.title}</span>
          </div>

          <div className="flex gap-1 py-[6px]">
            <div className="text-sm font-semibold">{comment?.user?.username}</div>

            <div className="mb-[1px] self-end text-xs text-gray-secondary">
              commented {getRelativeTime(comment.created_at, true)}
            </div>
          </div>

          {showRemovedByModeration ? (
            <RemovalMessage show={true} type="comment" className="!my-1" />
          ) : (
            <div className="mr-6 whitespace-pre-line break-all py-[6px]">
              {comment.is_deleted ? (
                <DeletedByPoster type="comment" />
              ) : (
                comment.content
              )}
            </div>
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
              isSaved={
                comment?.saved_by?.[0]?.user_id === userId && userId !== undefined
              }
              hasReported={
                comment?.reports?.[0]?.reporter_id === userId && userId !== undefined
              }
              isMobile={false}
              isLast={isLast}
              setComments={
                setSavedComments as unknown as React.Dispatch<
                  React.SetStateAction<DBCommentWithReplies[]>
                >
              }
              manageSaveFunc={(action) => {
                if (!token || !userId) return;

                void manageSavedComments(
                  token,
                  comment.id,
                  action ? 'save' : 'unsave',
                  () => {
                    setUserHistory?.((prev) => {
                      if (!prev) return prev;

                      return prev.map((item) =>
                        item.item_type === 'comment'
                          ? { ...item, saved_by: action ? [{ user_id: userId }] : [] }
                          : item,
                      );
                    });

                    setSavedComments?.((prev) => {
                      if (!prev) return prev;

                      return prev.filter(
                        (savedComment) => savedComment.id !== comment.id,
                      );
                    });
                  },
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
