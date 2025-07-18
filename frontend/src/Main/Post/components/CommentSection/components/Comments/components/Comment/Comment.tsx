import { useState } from 'react';

import UserPFP from '@/components/user/UserPFP';
import CommentInteractionBar from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/CommentInteractionBar';
import HideOrShow from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/HideOrShow';
import ReplyEditor from '@/Main/Post/components/ReplyEditor/ReplyEditor';
import MoreRepliesButton from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/MoreRepliesButton/MoreRepliesButton';
import CommentContent from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/CommentContent/CommentContent';
import { Link } from 'react-router-dom';

import getRelativeTime from '@/util/getRelativeTime';
import { manageSavedComments } from '@/Main/Saved/api/savedApi';
import { onCommentUpdate } from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/ModMenuComment/hooks/useCommentModeration';
import notLoggedInError from '@/util/notLoggedInError';

import { DBCommentWithReplies } from '@/interface/dbSchema';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import { NavigateFunction } from 'react-router-dom';
import { VoteType } from '@/interface/backendTypes';
import { TokenUser } from '@/context/auth/AuthProvider';
import { IsMod } from '@/Main/Community/components/Virtualization/VirtualizedPostOverview';
import './css/comment.css';

interface CommentProps {
  comment: DBCommentWithReplies;
  depth: number;
  post: { id: string; title: string; lock_comments: boolean };
  user: TokenUser | null;
  token: string | null;
  originalPoster: string | null;
  isMod: IsMod;
  isMobile: boolean;
  isBelow550px: boolean;
  lastCommentId: string;
  penultimateCommentId: string;
  showDropdown: string | null;
  setShowDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  showModDropdown: string | null;
  setShowModDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  navigate: NavigateFunction;
  onVote: (
    commentId: string,
    voteType: VoteType,
    previousVoteType: VoteType | undefined,
  ) => void;
  onDelete: (commentId: string) => void;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  onModerationCb?: (action: 'APPROVED' | 'REMOVED') => void;
}

// TODO: Add user flair :)
export default function Comment({
  comment,
  depth,
  post,
  user,
  token,
  originalPoster,
  navigate,
  onVote,
  onDelete,
  setComments,
  setPost,
  showDropdown,
  setShowDropdown,
  showModDropdown,
  setShowModDropdown,
  isMod,
  onModerationCb,
  isMobile,
  isBelow550px,
  lastCommentId,
  penultimateCommentId,
}: CommentProps) {
  const { id: postId, lock_comments } = post;

  const [showReply, setShowReply] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [hideReplies, setHideReplies] = useState(false);
  const [isEditActive, setIsEditActive] = useState(false);

  const hasReplyAtAll = comment.replies === undefined && comment._count.replies >= 1;
  const hasReply = comment.replies?.length > 0;
  const userDeleted = comment.user?.deleted_at;
  const hasReported = (comment?.reports?.length ?? 0) > 0;
  const isSaved =
    comment?.saved_by?.[0]?.user_id === user?.id && user?.id !== undefined;
  const loggedIn = token && user;

  const redirectToUser = (username: string) => {
    if (!userDeleted) {
      navigate(`/user/${username}`);
    }
  };

  const toggleShow = (wasSubmitted = false) => {
    if (!loggedIn) {
      notLoggedInError('You need to log in to reply to comments');
      return;
    }

    if (wasSubmitted) {
      setCommentText('');
      setShowReply(false);
      return;
    }

    if (commentText) {
      const cancel = confirm(
        'You have a comment in progress, are you sure you want to discard it?',
      );

      if (cancel) {
        setCommentText('');
        setShowReply(!showReply);
      }
    } else {
      setShowReply(!showReply);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col gap-1 transition-all ${depth >= 8 && hasReplyAtAll && 'comment-active'}`}
        style={{ marginLeft: `${depth * (isBelow550px ? 10 : 30)}px` }}
      >
        <div className="flex items-center gap-1">
          <div
            className={`${depth > 0 && !isBelow550px && 'comment-connector-line'}`}
          ></div>
          <UserPFP
            url={comment.user?.profile_picture_url ?? null}
            onClick={() =>
              comment.user?.username && redirectToUser(comment.user.username)
            }
            classname={`${depth === 0 && '-ml-[2px] mr-[2px]'}`}
          />

          <div className={`text-sm font-bold ${depth === 0 ? '' : 'ml-[4px]'}`}>
            {comment.is_deleted || userDeleted ? (
              <span className="text-gray-300">[deleted]</span>
            ) : (
              <Link
                to={comment.user?.username ? `/user/${comment.user?.username}` : ''}
                className="hover:underline"
              >
                {comment.user?.username}
              </Link>
            )}
          </div>

          {comment.user?.username === originalPoster && (
            <div className="pt-[2px] text-xs text-blue-500 df">OP</div>
          )}

          <div className="ml-1 text-xs text-gray-secondary">
            • {getRelativeTime(comment.created_at, true)}
          </div>
          {comment.edited_at && !comment.is_deleted && (
            <div className="text-xs text-gray-secondary">
              • edited {getRelativeTime(comment.edited_at, true, isMobile)}
            </div>
          )}
        </div>

        <div className="flex">
          <div className="grid min-w-11 grid-rows-[1fr_32px]">
            <div className="-mb-[6px] -mt-[3px] df">
              {hasReply && (
                <div className="h-full max-w-[1px] border border-gray-500"></div>
              )}
            </div>

            {hasReply && <HideOrShow hide={hideReplies} setHide={setHideReplies} />}
          </div>

          <div className="w-full">
            <CommentContent
              comment={{ ...comment }}
              isMod={isMod}
              depth={depth}
              isEditActive={isEditActive}
              setIsEditActive={setIsEditActive}
              setComments={setComments}
              token={token}
            />

            <CommentInteractionBar
              totalVoteCount={comment.total_vote_score}
              userVote={{
                hasVoted: comment?.comment_votes?.[0]?.user_id === user?.id,
                voteType: comment?.comment_votes?.[0]?.vote_type,
              }}
              commentId={comment.id}
              moderation={comment.moderation}
              setComments={setComments}
              isDeleted={comment.is_deleted}
              onVoteComment={onVote}
              onDeleteComment={onDelete}
              manageSaveFunc={(action) => {
                if (!token || !user) return;

                void manageSavedComments(
                  token,
                  comment.id,
                  action ? 'save' : 'unsave',
                  () => {
                    onCommentUpdate(
                      comment.id,
                      (commentToUpdate) => ({
                        ...commentToUpdate,
                        saved_by: action ? [{ user_id: user.id }] : [],
                      }),
                      setComments,
                    );
                  },
                );
              }}
              toggleShow={toggleShow}
              isUserSelf={comment.user_id === user?.id}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              showModDropdown={showModDropdown}
              setShowModDropdown={setShowModDropdown}
              isEditActive={isEditActive}
              setIsEditActive={setIsEditActive}
              isLocked={lock_comments}
              isMod={isMod}
              token={token}
              hasReported={hasReported}
              isMobile={isMobile}
              onModerationCb={onModerationCb}
              isSaved={isSaved}
              isLast={
                comment.id === lastCommentId || comment.id === penultimateCommentId
              }
            />
          </div>
        </div>

        {!post.lock_comments && (
          <ReplyEditor
            show={showReply}
            repliesHidden={hideReplies}
            depth={depth}
            toggleShow={toggleShow}
            setCommentText={setCommentText}
            commentText={commentText}
            postId={postId}
            commentId={comment.id}
            parentCommentId={comment.id}
            setComments={setComments}
            setPost={setPost}
            user={user}
            token={token}
            isReply={true}
            hasReply={hasReply}
          />
        )}

        <MoreRepliesButton
          hasReplyAtAll={hasReplyAtAll}
          parent_comment_id={comment.id}
        />
      </div>

      {!hideReplies && (
        <ul
          className={`${comment.replies?.length > 1 && 'comment'}`}
          style={
            {
              '--left-offset': `${21 + depth * (isBelow550px ? 8 : 30)}px`,
            } as React.CSSProperties
          }
        >
          {comment.replies?.map((commentReply) => (
            <li key={commentReply.id}>
              <Comment
                comment={commentReply}
                depth={depth + 1}
                post={{ ...post }}
                user={user}
                token={token}
                originalPoster={originalPoster}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                showModDropdown={showModDropdown}
                setShowModDropdown={setShowModDropdown}
                isMod={isMod}
                onModerationCb={onModerationCb}
                isMobile={isMobile}
                isBelow550px={isBelow550px}
                lastCommentId={lastCommentId}
                penultimateCommentId={penultimateCommentId}
                navigate={navigate}
                onVote={onVote}
                onDelete={onDelete}
                setComments={setComments}
                setPost={setPost}
                key={commentReply.id}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
